/**
 * Validated environment configuration.
 *
 * `AGENTS.md` §18 / §23: every external input is untrusted, and
 * configuration comes from environment variables that are validated once
 * at boot rather than read ad-hoc across the codebase (`AGENTS.md` §28:
 * no duplicated logic).
 *
 * The process must fail fast and loudly on bad configuration, so the
 * parsed result is exported as a frozen object rather than `process.env`.
 */

import { config as loadDotEnv } from "dotenv";
import { z } from "zod";

/**
 * Load the repository-root `.env` file.
 *
 * Values already present in the real environment always win, so container
 * and CI configuration is never silently overridden by a local file.
 */
loadDotEnv({ path: new URL("../../../../.env", import.meta.url), quiet: true });

/**
 * The authoritative variable list lives in `.env.example`.
 * Keep the two in step. Sources: docs/ROADMAP.md §13,
 * docs/ARCHITECTURE.md §42, AGENTS.md §44.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "silent"]).default("info"),

  /** Canonical server-side API base, including the version prefix. */
  API_BASE_URL: z.url().default("http://localhost:4000/api/v1"),

  /** PostgreSQL connection string. */
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  /** Comma-separated allow-list. Never `*` outside development. */
  CORS_ORIGINS: z.string().min(1).default("http://localhost:3000"),

  /**
   * Required before the auth module ships (docs/ROADMAP.md §7.3).
   * Optional at the foundation stage because no auth endpoint exists yet.
   */
  AUTH_SECRET: z.string().min(32).optional(),

  /**
   * Business contact details. Unconfirmed (docs/ROADMAP.md §5, §16) and
   * therefore optional; no code may substitute an invented fallback
   * (AGENTS.md §8).
   */
  WHATSAPP_NUMBER: z.string().min(1).optional(),
  PHONE_NUMBER: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);

  if (result.success) {
    return Object.freeze(result.data);
  }

  const details = result.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env: Env = loadEnv();

/** Origins permitted to call the API, parsed once. */
export const corsOrigins: readonly string[] = Object.freeze(
  env.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0),
);

export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
