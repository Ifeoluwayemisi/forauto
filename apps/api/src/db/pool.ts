/**
 * PostgreSQL connection pool.
 *
 * `pg` only — no ORM. `docs/API.md` §63, AGENTS.md §5, §15.
 */

import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { env, isProduction } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Numeric/array parsing is left at the driver default. Timestamps are the
 * only type deliberately converted, because `TIMESTAMPTZ` values must not
 * be reinterpreted in the server's local zone
 * (`docs/API.md` §42, docs/DATABASE.md §42).
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: isProduction ? 10 : 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  application_name: "forauto-api",
});

pool.on("error", (error) => {
  // An idle client failed. Log and let the pool replace it rather than
  // letting an unhandled 'error' event take the process down.
  logger.error("Unexpected error on an idle PostgreSQL client", {
    error_name: error.name,
    error_message: error.message,
  });
});

/**
 * Run a single parameterized statement.
 *
 * `text` must contain `$1`-style placeholders only. Never interpolate
 * caller-supplied values into SQL (`AGENTS.md` §15, docs/API.md §46).
 * `values` is passed straight to the driver.
 */
export async function query<TRow extends QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<TRow>> {
  return pool.query<TRow>(text, values as unknown[]);
}

/** Convenience accessor for a single row, or `null`. */
export async function queryOne<TRow extends QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<TRow | null> {
  const result = await query<TRow>(text, values);
  return result.rows[0] ?? null;
}

export type { PoolClient, QueryResult, QueryResultRow };

/** Close the pool during graceful shutdown. */
export async function closePool(): Promise<void> {
  await pool.end();
}
