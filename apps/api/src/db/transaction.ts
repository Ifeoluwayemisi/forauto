/**
 * Transaction helper.
 *
 * `AGENTS.md` §16 / docs/ARCHITECTURE.md §45: use a transaction when
 * several writes must succeed or fail together, and not otherwise. The
 * callback receives the client so that every statement inside one
 * transaction is guaranteed to run on the same connection — the most
 * common source of subtle bugs when a pool is involved.
 *
 * Example (docs/API.md §62): a guest service request creates a customer,
 * a vehicle and a request atomically.
 */

import type { PoolClient, QueryResult, QueryResultRow } from "pg";
import { describeError, logger } from "../utils/logger.js";
import { pool } from "./pool.js";

export type TransactionCallback<T> = (client: PoolClient) => Promise<T>;

export async function withTransaction<T>(callback: TransactionCallback<T>): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      // The original failure is the one worth reporting; a failed
      // rollback usually means the connection is already gone.
      logger.error("Transaction rollback failed", describeError(rollbackError));
    }
    throw error;
  } finally {
    client.release();
  }
}

/** Parameterized query bound to an existing transaction. */
export async function queryInTransaction<TRow extends QueryResultRow>(
  client: PoolClient,
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<TRow>> {
  return client.query<TRow>(text, values as unknown[]);
}
