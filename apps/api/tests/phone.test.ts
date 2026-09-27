/**
 * Phone normalisation is a business rule with real consequences: it is how
 * a returning customer is matched to their existing records, and how a
 * WhatsApp deep link is built. `AGENTS.md` §19 and §42.
 *
 * `AGENTS.md` §7: this is a test fixture, not production data. The numbers
 * are structurally valid but are not any real person's number.
 */

import { describe, expect, it } from "vitest";
import { isSameNigerianPhone, normaliseNigerianPhone } from "../src/utils/phone.js";

/**
 * Structurally valid sample number:
 *   08055153346        (11 digits, local)
 *   8055153346         (10 digits, national)
 *   2348055153346      (13 digits, canonical)
 */
const LOCAL = "08055153346";
const CANONICAL = "2348055153346";

describe("normaliseNigerianPhone", () => {
  it.each([
    [LOCAL, "local format"],
    [`+${CANONICAL}`, "international with a plus"],
    [CANONICAL, "international without a plus"],
    ["0805 515 3346", "local with spaces"],
    ["0805-515-3346", "local with a hyphen"],
    ["(0805) 5153346", "local with brackets"],
    ["  08055153346  ", "surrounding whitespace"],
    ["+234 805 515 3346", "international with spaces"],
  ])("normalises %s (%s) to the canonical form", (input) => {
    const result = normaliseNigerianPhone(input);

    expect(result).toEqual({ ok: true, value: CANONICAL });
  });

  it.each([
    ["", "an empty value"],
    ["   ", "whitespace only"],
    ["0805515334", "too few digits"],
    ["080551533460", "too many digits"],
    ["+234 805 513 346", "a Nigerian prefix with too few national digits"],
    ["+44 8055 13346", "a non-Nigerian country code"],
    ["8055133460", "a national number with no trunk prefix"],
    ["08055abc346", "letters mixed in"],
    ["++2348055153346", "a doubled plus"],
  ])("rejects %s (%s)", (input) => {
    expect(normaliseNigerianPhone(input).ok).toBe(false);
  });

  it("explains why a value was rejected", () => {
    const result = normaliseNigerianPhone("0805515334");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/complete Nigerian phone number/i);
    }
  });
});

describe("isSameNigerianPhone", () => {
  it("treats equivalent formats as the same number", () => {
    expect(isSameNigerianPhone(LOCAL, `+${CANONICAL}`)).toBe(true);
    expect(isSameNigerianPhone("0805 515 3346", CANONICAL)).toBe(true);
  });

  it("treats different numbers as different", () => {
    expect(isSameNigerianPhone(LOCAL, "08055153347")).toBe(false);
  });

  it("does not match an invalid number against a valid one", () => {
    expect(isSameNigerianPhone("not-a-number", LOCAL)).toBe(false);
  });
});
