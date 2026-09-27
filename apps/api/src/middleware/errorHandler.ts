/**
 * Error normalisation.
 *
 * `docs/API.md` §7 defines the single error envelope the whole API must
 * use, §8 the status codes, and §49 the rule that internal detail must
 * never leak. `AGENTS.md` §24 forbids silently swallowing errors: every
 * failure is logged with its request ID and returned in a predictable
 * shape.
 */

import type { ApiErrorResponse } from "@forauto/types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isProduction } from "../config/env.js";
import { AppError, isAppError } from "../utils/errors.js";
import { describeError } from "../utils/logger.js";

/**
 * Fastify's own errors carry a `statusCode` and a `code` (e.g.
 * `FST_ERR_CTP_INVALID_MEDIA_TYPE`, or `VALIDATION_ERROR` for a schema
 * failure). They are translated rather than passed through, so the client
 * only ever sees documented codes.
 */
function fromFastifyError(error: FastifyError): AppError {
  switch (error.code) {
    case "FST_ERR_CTP_INVALID_MEDIA_TYPE":
      return new AppError("UNSUPPORTED_FILE_TYPE", "Unsupported content type.", {
        cause: error,
      });
    case "FST_ERR_CTP_EMPTY_JSON_BODY":
    case "FST_ERR_CTP_INVALID_JSON_BODY":
    case "FST_ERR_VALIDATION":
      return new AppError("VALIDATION_ERROR", "The request body failed validation.", {
        cause: error,
      });
    case "FST_ERR_CTP_BODY_TOO_LARGE":
      return new AppError("FILE_TOO_LARGE", "The request payload is too large.", {
        cause: error,
      });
    default:
      break;
  }

  const status = error.statusCode ?? 500;

  if (status === 400) {
    return new AppError("VALIDATION_ERROR", error.message, { cause: error });
  }

  if (status === 404) {
    return new AppError("NOT_FOUND", "Resource not found.", { cause: error });
  }

  if (status === 413) {
    return new AppError("FILE_TOO_LARGE", error.message, { cause: error });
  }

  if (status === 415) {
    return new AppError("UNSUPPORTED_FILE_TYPE", error.message, { cause: error });
  }

  if (status === 429) {
    return new AppError("RATE_LIMITED", error.message, { cause: error });
  }

  if (status >= 400 && status < 500) {
    return new AppError("VALIDATION_ERROR", error.message, { cause: error });
  }

  return new AppError("INTERNAL_ERROR", "Something went wrong.", {
    cause: error,
    expected: false,
  });
}

interface FastifyError extends Error {
  code?: string;
  statusCode?: number;
}

function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return fromFastifyError(error as FastifyError);
  }

  return new AppError("INTERNAL_ERROR", "Something went wrong.", {
    cause: error,
    expected: false,
  });
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: unknown, request: FastifyRequest, reply: FastifyReply) => {
    const appError = toAppError(error);

    if (appError.expected) {
      // A rejected request is normal operation, not an incident.
      request.appLog.warn("request_rejected", {
        error_code: appError.code,
        status_code: appError.statusCode,
        error_message: appError.message,
      });
    } else {
      request.appLog.error("request_failed", {
        error_code: appError.code,
        status_code: appError.statusCode,
        ...describeError(appError.cause ?? appError),
      });
    }

    // The client gets the documented code and a safe message. The cause,
    // the stack and the request ID are kept in the log, never in the body
    // (docs/API.md §49; AGENTS.md §23).
    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: appError.code,
        message: isProduction ? "Something went wrong." : appError.message,
        ...(appError.details ? { details: appError.details } : {}),
      },
    };

    void reply.status(appError.statusCode).send(body);
  });

  // Unmatched routes must produce the same envelope as everything else,
  // rather than Fastify's default 404 shape.
  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `No route matches ${request.method} ${request.url}.`,
      },
    };

    request.appLog.info("route_not_found", { method: request.method });

    void reply.status(404).send(body);
  });
}
