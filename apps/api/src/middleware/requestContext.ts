/**
 * Request identity and access logging.
 *
 * `docs/API.md` §53 requires a unique request ID per request, surfaced as
 * `X-Request-ID`, so a customer-reported failure can be traced through the
 * logs. §52 requires method, route, status, duration and (where
 * available) the user ID to be recorded.
 *
 * `AGENTS.md` §23 additionally requires that tokens, passwords and
 * unnecessary personal data are never logged — the logger redacts those
 * field names, and only non-identifying fields are recorded here.
 */

import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { type Logger, logger } from "../utils/logger.js";

declare module "fastify" {
  interface FastifyRequest {
    /** Correlation ID for this request. Always set. */
    requestId: string;
    /**
     * Request-scoped FORauto logger, pre-bound with the request ID.
     *
     * Deliberately NOT named `log`: Fastify already decorates
     * `request.log` with its own `FastifyBaseLogger`, and shadowing it
     * would break Fastify internals. Fastify's own logger stays disabled
     * (`logger: false` in `app.ts`) so there is no duplicate output.
     */
    appLog: Logger;
  }
}

/** Echo a caller-supplied ID only if it is short and printable. */
function isAcceptableRequestId(value: string): boolean {
  return value.length > 0 && value.length <= 128 && /^[\w.:-]+$/.test(value);
}

export function registerRequestContext(app: FastifyInstance): void {
  app.decorateRequest("requestId", "");
  app.decorateRequest("appLog", null as unknown as Logger);

  app.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    const supplied = request.headers["x-request-id"];
    const candidate = Array.isArray(supplied) ? supplied[0] : supplied;

    const requestId =
      typeof candidate === "string" && isAcceptableRequestId(candidate) ? candidate : randomUUID();

    request.requestId = requestId;
    request.appLog = logger.child({ request_id: requestId });

    void reply.header("X-Request-ID", requestId);
  });

  app.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply) => {
    // `routeOptions.url` is the route pattern (`/api/v1/vehicles/:id`), not
    // the concrete path, so IDs and slugs are not written to the log.
    //
    // `user_id` (docs/API.md §52) is intentionally absent: it must come
    // from a verified principal set by the auth middleware, never from a
    // client-supplied header (AGENTS.md §22).
    request.appLog.info("request", {
      method: request.method,
      route: request.routeOptions.url ?? "unmatched",
      status_code: reply.statusCode,
      duration_ms: Math.round(reply.elapsedTime),
    });
  });
}
