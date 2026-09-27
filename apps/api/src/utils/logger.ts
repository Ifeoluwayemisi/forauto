/**
 * Structured JSON logger.
 *
 * `docs/ARCHITECTURE.md` §40 requires structured server logs;
 * `docs/API.md` §52 lists the useful fields and, critically, the things
 * that must never be logged (passwords, tokens, secrets, private
 * uploaded content).
 *
 * Hand-rolled rather than pulled from a logging library: the
 * requirement is a flat JSON object, and AGENTS.md §37 warns against
 * unnecessary third-party services and dependencies.
 */

import { env, isProduction } from "../config/env.js";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel | "silent", number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

/**
 * Keys that must never reach a log sink, matched case-insensitively
 * against the top-level field name. `docs/API.md` §52.
 */
const REDACTED_KEYS = new Set([
  "password",
  "passwordhash",
  "password_hash",
  "token",
  "accesstoken",
  "access_token",
  "refreshtoken",
  "refresh_token",
  "authorization",
  "cookie",
  "setcookie",
  "set-cookie",
  "secret",
  "authsecret",
  "auth_secret",
  "apikey",
  "api_key",
  "databaseurl",
  "database_url",
  "storageaccesskey",
  "storage_access_key",
  "storagesecretkey",
  "storage_secret_key",
]);

const REDACTED = "[redacted]";

type LogFields = Record<string, unknown>;

function sanitise(fields: LogFields): LogFields {
  const output: LogFields = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) {
      continue;
    }

    output[key] = REDACTED_KEYS.has(key.toLowerCase()) ? REDACTED : value;
  }

  return output;
}

function write(level: LogLevel, message: string, fields: LogFields = {}): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[env.LOG_LEVEL]) {
    return;
  }

  const record = {
    level,
    time: new Date().toISOString(),
    message,
    ...sanitise(fields),
  };

  // In production a single JSON line per event is what log shippers and
  // error monitors expect (docs/ARCHITECTURE.md §40).
  const line = JSON.stringify(record);

  if (level === "error") {
    process.stderr.write(`${line}\n`);
  } else {
    process.stdout.write(`${line}\n`);
  }
}

export interface Logger {
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
  child(boundFields: LogFields): Logger;
}

function createLogger(boundFields: LogFields = {}): Logger {
  return {
    debug: (message, fields = {}) => write("debug", message, { ...boundFields, ...fields }),
    info: (message, fields = {}) => write("info", message, { ...boundFields, ...fields }),
    warn: (message, fields = {}) => write("warn", message, { ...boundFields, ...fields }),
    error: (message, fields = {}) => write("error", message, { ...boundFields, ...fields }),
    child: (extra) => createLogger({ ...boundFields, ...extra }),
  };
}

/**
 * Serialisable summary of an unknown throwable. Stack traces are kept in
 * development and dropped in production (`AGENTS.md` §23).
 */
export function describeError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return isProduction
      ? { name: error.name, message: error.message }
      : { name: error.name, message: error.message, stack: error.stack };
  }

  return { name: "NonError", message: String(error) };
}

export const logger: Logger = createLogger();
