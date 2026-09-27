import { defineConfig } from "vitest/config";

/**
 * Test-only environment.
 *
 * `apps/api/src/config/env.ts` validates configuration eagerly at import
 * time so that a misconfigured server fails fast on boot. That is the
 * correct production behaviour, but it means any test that imports the app
 * needs the variables to be present.
 *
 * `DATABASE_URL` below is a throwaway placeholder, not a credential. Port 1
 * is closed, so the readiness check fails immediately and cheaply — no test
 * ever opens a real connection, and nothing here is a real secret
 * (`AGENTS.md` §7, §44).
 */
const TEST_ENV = {
  NODE_ENV: "test",
  LOG_LEVEL: "silent",
  DATABASE_URL: "postgresql://placeholder:placeholder@127.0.0.1:1/placeholder",
  CORS_ORIGINS: "http://localhost:3000",
} as const;

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    env: TEST_ENV,
    include: ["apps/*/tests/**/*.test.ts", "packages/*/tests/**/*.test.ts"],
    // Fail fast rather than letting a half-open pool keep a run alive.
    teardownTimeout: 10_000,
  },
});
