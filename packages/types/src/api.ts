/**
 * FORauto — API transport contract.
 *
 * `docs/API.md` is the contract owner (`docs/ARCHITECTURE.md` §17, §59).
 * These types describe the wire format only. Business rules,
 * status-transition rules and authorization live in the backend.
 */

/**
 * Stable error codes. `docs/API.md` §51.
 *
 * These are contract, not presentation: clients are expected to branch
 * on `code`, never on `message` (`docs/API.md` §7).
 */
export const API_ERROR_CODES = [
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "INVALID_STATUS_TRANSITION",
  "RESOURCE_OWNERSHIP_ERROR",
  "DUPLICATE_REQUEST",
  "RATE_LIMITED",
  "FILE_TOO_LARGE",
  "UNSUPPORTED_FILE_TYPE",
  "UPLOAD_FAILED",
  "AUTHENTICATION_FAILED",
  "SESSION_EXPIRED",
  "INTERNAL_ERROR",
  "SERVICE_UNAVAILABLE",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

/** Successful single-resource response. `docs/API.md` §6. */
export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

/** Pagination block for collection responses. `docs/API.md` §6, §37. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/** Successful collection response. `docs/API.md` §6. */
export interface ApiCollectionResponse<TItem> extends ApiSuccessResponse<TItem[]> {
  meta: PaginationMeta;
}

/** Field-level validation detail. `docs/API.md` §7. */
export type ApiErrorDetails = Record<string, string | string[]>;

/** Error response. `docs/API.md` §7. */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: ApiErrorDetails;
  };
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

/** Documented defaults and caps. `docs/API.md` §37. */
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
} as const;

/**
 * Sort fields must be whitelisted; a raw column name must never reach
 * SQL (`docs/API.md` §39, AGENTS.md §15).
 */
export const SORT_ORDERS = ["asc", "desc"] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

/** The authenticated caller, as attached by API middleware. */
export interface AuthenticatedPrincipal {
  userId: string;
  role: "CUSTOMER" | "STAFF";
  /** Present for staff principals. */
  staffId?: string;
  staffRole?: import("./status.js").StaffRole;
  /** Present for customer principals. */
  customerId?: string;
}
