/**
 * Operational health endpoints.
 *
 * `docs/API.md` §54 and `docs/ARCHITECTURE.md` §41 specify two:
 *
 *   GET /health       — is the process alive?
 *   GET /health/ready — are required dependencies available?
 *
 * Both sit at the root, outside `/api/v1`, because they are consumed by
 * infrastructure (load balancers, orchestrators) rather than by the
 * product's clients. `docs/API.md` §54 also requires that they expose no
 * secrets or internal infrastructure detail.
 *
 * Object storage is deliberately NOT probed yet: no provider has been
 * selected (docs/ARCHITECTURE.md §25) and the media module has not been
 * built. Add it here when it exists.
 */

import type { FastifyInstance } from "fastify";
import { pool } from "../db/pool.js";

interface ReadinessReport {
  status: "ok" | "degraded";
  checks: Record<string, "ok" | "unavailable">;
}

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get("/health", async () => ({
    status: "ok",
    uptime_seconds: Math.round(process.uptime()),
  }));

  app.get("/health/ready", async (_request, reply) => {
    const checks: ReadinessReport["checks"] = {};
    let healthy = true;

    try {
      await pool.query("SELECT 1");
      checks.database = "ok";
    } catch {
      // Deliberately reports availability only. Connection strings, host
      // names and driver messages must not reach an unauthenticated
      // endpoint (docs/API.md §54).
      checks.database = "unavailable";
      healthy = false;
    }

    const report: ReadinessReport = {
      status: healthy ? "ok" : "degraded",
      checks,
    };

    return reply.status(healthy ? 200 : 503).send(report);
  });
}
