/**
 * SQL migration runner.
 *
 * `AGENTS.md` §15 and §40 / `docs/ARCHITECTURE.md` §44 / `docs/DATABASE.md` §57:
 * every schema change is a version-controlled `.sql` file under
 * `database/migrations`, applied in order. No ORM is introduced — this is
 * a deliberately small runner so the mechanism is readable and has no
 * third-party dependencies (AGENTS.md §37).
 *
 * Properties:
 *   • ordered       — files are applied in filename order
 *   • deterministic — each file runs inside its own transaction
 *   • reviewable    — a plain `.sql` diff is the whole change
 *   • idempotent    — already-applied versions are skipped
 *   • tamper-evident— an applied file whose contents later change is
 *                     reported as an error, because rewriting history
 *                     silently invalidates every environment
 *
 * Usage:
 *   npm run migrate            # apply all pending migrations
 *   npm run migrate:status     # list applied and pending migrations
 */

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import { env } from "../src/config/env.js";
import { describeError, logger } from "../src/utils/logger.js";

/**
 * Repository-root `database/migrations`, resolved from this file
 * (`apps/api/scripts/` -> up three levels to the repository root).
 */
const MIGRATIONS_DIR = fileURLToPath(new URL("../../../database/migrations", import.meta.url));

const LEDGER_TABLE = "schema_migrations";

interface MigrationFile {
  version: string;
  filename: string;
  sql: string;
  checksum: string;
}

interface LedgerRow {
  version: string;
  checksum: string;
  applied_at: Date;
}

/** `012_work_items.sql` -> version `012`. Order is the filename prefix. */
function parseVersion(filename: string): string {
  const match = /^(\d+)_/.exec(filename);
  if (!match?.[1]) {
    throw new Error(
      `Migration "${filename}" does not start with a numeric version prefix (e.g. 001_name.sql).`,
    );
  }
  return match[1];
}

async function loadMigrations(): Promise<MigrationFile[]> {
  const entries = await readdir(MIGRATIONS_DIR);
  const sqlFiles = entries.filter((name) => name.endsWith(".sql")).sort();

  const migrations = await Promise.all(
    sqlFiles.map(async (filename) => {
      const sql = await readFile(path.join(MIGRATIONS_DIR, filename), "utf8");
      return {
        version: parseVersion(filename),
        filename,
        sql,
        checksum: createHash("sha256").update(sql).digest("hex"),
      };
    }),
  );

  // Two files sharing a version prefix would make the ledger ambiguous.
  const seen = new Set<string>();
  for (const migration of migrations) {
    if (seen.has(migration.version)) {
      throw new Error(`Duplicate migration version ${migration.version} (${migration.filename}).`);
    }
    seen.add(migration.version);
  }

  return migrations;
}

async function createLedger(client: Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${LEDGER_TABLE} (
      version    TEXT        PRIMARY KEY,
      checksum   TEXT        NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function readLedger(client: Client): Promise<Map<string, LedgerRow>> {
  const { rows } = await client.query<LedgerRow>(
    `SELECT version, checksum, applied_at FROM ${LEDGER_TABLE}`,
  );
  return new Map(rows.map((row) => [row.version, row]));
}

function assertUnmodified(migration: MigrationFile, applied: LedgerRow): void {
  if (applied.checksum === migration.checksum) {
    return;
  }

  throw new Error(
    `Migration ${migration.filename} has already been applied but its contents have changed.\n` +
      "Applied migrations are immutable. Create a new migration instead of editing this one.",
  );
}

async function applyPending(client: Client): Promise<number> {
  const migrations = await loadMigrations();
  await createLedger(client);
  const ledger = await readLedger(client);

  let applied = 0;

  for (const migration of migrations) {
    const already = ledger.get(migration.version);

    if (already) {
      assertUnmodified(migration, already);
      continue;
    }

    logger.info("migration_applying", { version: migration.version, file: migration.filename });

    await client.query("BEGIN");
    try {
      await client.query(migration.sql);
      await client.query(`INSERT INTO ${LEDGER_TABLE} (version, checksum) VALUES ($1, $2)`, [
        migration.version,
        migration.checksum,
      ]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Migration ${migration.filename} failed and was rolled back: ${describeError(error).message}`,
        { cause: error },
      );
    }

    applied += 1;
  }

  return applied;
}

async function printStatus(client: Client): Promise<void> {
  const migrations = await loadMigrations();
  await createLedger(client);
  const ledger = await readLedger(client);

  process.stdout.write("version  status   file\n");
  process.stdout.write("-------  -------  --------------------------------\n");

  for (const migration of migrations) {
    const already = ledger.get(migration.version);
    const status = already ? "applied" : "PENDING";
    process.stdout.write(
      `${migration.version.padEnd(7)}  ${status.padEnd(7)}  ${migration.filename}\n`,
    );
  }
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? "up";
  const client = new Client({ connectionString: env.DATABASE_URL });

  await client.connect();

  try {
    if (command === "status") {
      await printStatus(client);
      return;
    }

    if (command !== "up") {
      throw new Error(`Unknown command "${command}". Expected "up" or "status".`);
    }

    const applied = await applyPending(client);

    logger.info("migrations_complete", { applied, command });
  } finally {
    await client.end();
  }
}

try {
  await main();
} catch (error) {
  logger.error("migration_failed", describeError(error));
  process.exit(1);
}
