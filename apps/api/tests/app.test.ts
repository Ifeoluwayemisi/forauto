/**
 * The API contract itself: response envelope, error envelope, status codes,
 * request IDs and health. These are the guarantees the frontend will
 * depend on, so they are worth pinning down now
 * (docs/API.md §6, §7, §8, §53, §54; AGENTS.md §42).
 *
 * Uses `app.inject()` so no port is bound (docs/API.md §56).
 */

import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import { closePool } from "../src/db/pool.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await closePool();
});

describe("GET /health", () => {
  it("reports that the process is alive without touching the database", async () => {
    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: "ok" });
  });
});

describe("request IDs", () => {
  it("generates an X-Request-ID when the caller does not supply one", async () => {
    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("echoes a caller-supplied X-Request-ID so a failure can be traced", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: { "x-request-id": "trace-abc-123" },
    });

    expect(response.headers["x-request-id"]).toBe("trace-abc-123");
  });

  it("ignores an implausible caller-supplied request ID", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: { "x-request-id": "a".repeat(200) },
    });

    expect(response.headers["x-request-id"]).not.toBe("a".repeat(200));
  });
});

describe("unmatched routes", () => {
  it("returns the documented error envelope", async () => {
    const response = await app.inject({ method: "GET", url: "/api/v1/does-not-exist" });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "No route matches GET /api/v1/does-not-exist.",
      },
    });
  });
});

describe("health readiness", () => {
  it("never leaks a connection string or driver message", async () => {
    const response = await app.inject({ method: "GET", url: "/health/ready" });

    const body = response.body;

    // Whether or not PostgreSQL is reachable, only availability may appear.
    expect(body).not.toMatch(/postgres(ql)?:\/\//i);
    expect(body).not.toMatch(/ECONNREFUSED|password|host=/i);
    expect(Object.keys(response.json().checks)).toEqual(["database"]);
  });
});
