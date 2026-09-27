/**
 * Process entry point: bind the port and shut down cleanly.
 *
 * `AGENTS.md` §24: failures must be explicit. A boot failure is logged
 * and the process exits non-zero rather than starting in a broken state.
 */

import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { closePool } from "./db/pool.js";
import { describeError, logger } from "./utils/logger.js";

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"] as const;

async function main(): Promise<void> {
  const app = await buildApp();

  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, () => {
      logger.info("shutdown_signal_received", { signal });

      void app
        .close()
        .then(() => closePool())
        .then(() => {
          process.exit(0);
        })
        .catch((error: unknown) => {
          logger.error("shutdown_failed", describeError(error));
          process.exit(1);
        });
    });
  }

  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (error) {
    logger.error("server_start_failed", describeError(error));
    process.exit(1);
  }

  logger.info("server_started", {
    port: env.PORT,
    environment: env.NODE_ENV,
    api_base_url: env.API_BASE_URL,
  });
}

await main();
