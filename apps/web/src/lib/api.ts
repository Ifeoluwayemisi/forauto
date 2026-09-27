/**
 * Typed API client.
 *
 * The frontend is not a second business-logics layer (`AGENTS.md` §6): it
 * sends requests, renders responses, and forwards errors. Every decision
 * about what is allowed — ownership, status transitions, role checks —
 * belongs to the backend, which is authoritative
 * (`docs/ARCHITECTURE.md` §47).
 *
 * The base URL is `NEXT_PUBLIC_API_BASE_URL` and always includes the
 * version prefix (`docs/API.md` §2.3). See `.env.example`.
 */

import {
  API_ERROR_CODES,
  type ApiErrorCode,
  type ApiErrorDetails,
  type ApiResponse,
} from "@forauto/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

/**
 * A failed API call, carrying the documented machine-readable code so
 * callers never have to match on a human-readable message
 * (`docs/API.md` §7).
 */
export class ApiRequestError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details: ApiErrorDetails | undefined;

  constructor(status: number, code: ApiErrorCode, message: string, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const INTERNAL_ERROR: ApiErrorCode = "INTERNAL_ERROR";

function isKnownErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === "string" && (API_ERROR_CODES as readonly string[]).includes(value);
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

/**
 * Perform a request against `/api/v1` and unwrap the documented envelope.
 *
 * Non-2xx responses and malformed payloads both throw `ApiRequestError`,
 * so a caller has exactly one failure path to handle
 * (`AGENTS.md` §24: no silently swallowed errors).
 */
export async function apiRequest<TData>(
  path: string,
  { query, body, headers, ...init }: RequestOptions = {},
): Promise<TData> {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (payload as { error?: { code?: unknown; message?: unknown; details?: unknown } })
      ?.error;

    throw new ApiRequestError(
      response.status,
      isKnownErrorCode(error?.code) ? error.code : INTERNAL_ERROR,
      typeof error?.message === "string" ? error.message : "The request could not be completed.",
      (error?.details as ApiErrorDetails | undefined) ?? undefined,
    );
  }

  const success = payload as ApiResponse<TData> | null;

  if (success?.success !== true) {
    throw new ApiRequestError(
      response.status,
      INTERNAL_ERROR,
      "The API returned an unexpected response shape.",
    );
  }

  return success.data;
}
