/**
 * Application error type and the documented error-code vocabulary.
 *
 * `docs/API.md` §7 defines the wire format and §51 the stable codes.
 * `AGENTS.md` §24 requires predictable errors and §23 requires that
 * internal detail (stack traces, SQL, infrastructure names) never
 * reaches a production client.
 */

import { API_ERROR_CODES, type ApiErrorCode, type ApiErrorDetails } from "@forauto/types";

/** Maps each documented code to its HTTP status. `docs/API.md` §8. */
const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INVALID_STATUS_TRANSITION: 409,
  RESOURCE_OWNERSHIP_ERROR: 403,
  DUPLICATE_REQUEST: 409,
  RATE_LIMITED: 429,
  FILE_TOO_LARGE: 413,
  UNSUPPORTED_FILE_TYPE: 415,
  UPLOAD_FAILED: 500,
  AUTHENTICATION_FAILED: 401,
  SESSION_EXPIRED: 401,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export class AppError extends Error {
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly details: ApiErrorDetails | undefined;
  /** Logged at `error` level. Expected rejections should not be. */
  readonly expected: boolean;

  constructor(
    code: ApiErrorCode,
    message: string,
    options: { details?: ApiErrorDetails; cause?: unknown; expected?: boolean } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.statusCode = STATUS_BY_CODE[code];
    this.details = options.details;
    this.expected = options.expected ?? true;
  }
}

export const notFound = (message = "Resource not found."): AppError =>
  new AppError("NOT_FOUND", message);

export const validationError = (message: string, details?: ApiErrorDetails): AppError =>
  new AppError("VALIDATION_ERROR", message, { details });

export const unauthorized = (message = "Authentication required."): AppError =>
  new AppError("UNAUTHORIZED", message);

export const forbidden = (message = "You are not allowed to perform this action."): AppError =>
  new AppError("FORBIDDEN", message);

/**
 * Ownership failures deliberately return 403 rather than 404.
 * Returning 404 would confirm that the resource exists, leaking the
 * existence of another customer's records
 * (`AGENTS.md` §14, docs/API.md §43).
 */
export const ownershipError = (message = "You do not have access to this resource."): AppError =>
  new AppError("RESOURCE_OWNERSHIP_ERROR", message);

/** Rejects an illegal lifecycle move. `docs/API.md` §17, §22, §24. */
export const invalidStatusTransition = (message: string): AppError =>
  new AppError("INVALID_STATUS_TRANSITION", message);

export const internalError = (message = "Something went wrong.", cause?: unknown): AppError =>
  new AppError("INTERNAL_ERROR", message, { cause, expected: false });

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

export type { ApiErrorCode, ApiErrorDetails };
export { API_ERROR_CODES };
