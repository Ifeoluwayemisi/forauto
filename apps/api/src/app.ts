/**
 * Fastify application assembly.
 *
 * Kept separate from `server.ts` so tests can build an app instance and
 * drive it with `app.inject()` without binding a port
 * (docs/API.md §56 requires an API test suite).
 */

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyInstance, LogController } from "fastify";
import { corsOrigins, isProduction, isTest } from "./config/env.js";
import { registerErrorHandler } from "./middleware/errorHandler.js";
import { registerRequestContext } from "./middleware/requestContext.js";
import { registerHealthRoutes } from "./plugins/health.js";

/**
 * The version prefix for every product route. `docs/API.md` §2.3.
 * Health endpoints are mounted separately at the root (§54).
 */
export const API_PREFIX = "/api/v1";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    // The logger is provided by our own structured logger, not pino's
    // default, so log output is identical in every environment
    // (docs/ARCHITECTURE.md §40).
    logger: false,
    // Reject malformed JSON and oversized bodies at the edge
    // (docs/API.md §8 — 413, 415).
    bodyLimit: 1_048_576,
    trustProxy: isProduction,
    // Fastify's own request logging is off: every access log line is written
    // by `registerRequestContext` so the output is identical in every
    // environment (docs/ARCHITECTURE.md §40).
    logController: new LogController({ disableRequestLogging: true }),
    routerOptions: {
      // `/health/` and `/health` should not be two different endpoints.
      ignoreTrailingSlash: true,
    },
  });

  registerErrorHandler(app);
  registerRequestContext(app);

  await app.register(helmet, {
    // The API serves JSON only; a restrictive default policy costs nothing.
    contentSecurityPolicy: isProduction ? undefined : false,
  });

  await app.register(cors, {
    // Explicit allow-list. `docs/API.md` §50 forbids `*` for an
    // authenticated production API.
    origin: (origin, callback) => {
      // Same-origin and non-browser clients send no Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, corsOrigins.includes(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  await app.register(rateLimit, {
    // Baseline ceiling. `docs/API.md` §44 requires stricter per-route
    // limits on /auth/*, /service-requests and /media/upload-url; those are
    // applied when those routes exist. The exact numbers should be tuned
    // against real traffic, not guessed now.
    max: isTest ? 1_000_000 : 300,
    timeWindow: "1 minute",
    // Rate limiting is keyed by client IP behind a trusted proxy only.
    keyGenerator: (request) => request.ip,
    // 429 must use the documented envelope, not the plugin's default.
    errorResponseBuilder: (_request, context) => ({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: `Too many requests. Please retry in ${context.ttl} ms.`,
      },
    }),
  });

  registerHealthRoutes(app);

  /**
   * Product routes are registered under the version prefix.
   *
   * The scope is intentionally empty. Per docs/ROADMAP.md §24 the order is
   * database connection → migrations → API foundation → frontend
   * foundation → shared types/UI → authentication → features, and no
   * business module has been specified for implementation yet. No
   * placeholder or speculative endpoint is added here: `AGENTS.md` §41
   * forbids undocumented endpoints, and docs/API.md §64 requires the
   * contract and the implementation to be updated together.
   *
   * Each module will be registered as
   * `app.register(<module>Routes, { prefix: API_PREFIX })`, so this file
   * stays declarative instead of accumulating imports.
   */
  await app.register(async () => {}, { prefix: API_PREFIX });

  return app;
}
