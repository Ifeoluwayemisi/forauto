/**
 * Shared phone-number normalisation.
 *
 * `AGENTS.md` §19 requires that equivalent Nigerian formats resolve to one
 * canonical stored representation, and §28 forbids duplicating this logic
 * across modules — so it lives here, once, and is imported wherever a
 * phone number is accepted or compared.
 *
 * This is the single shared utility, not a per-module copy. It is a pure
 * function so it can be unit tested without a database.
 *
 * Accepted inputs (AGENTS.md §19):
 *   08055153346      local, 11 digits starting 0
 *   +234805513346    international, with a plus
 *   234805513346     international, without a plus
 *   0805 515 3346    local, with spaces or separators
 *
 * Canonical form: '234805513346' — digits only, no plus, no separators.
 * This is also the form the WhatsApp deep link requires.
 *
 * A library is not used: the rule is small, fully specified here, and
 * AGENTS.md §37 discourages unnecessary dependencies.
 */

/** Nigerian mobile numbers are 10 digits after the country code. */
const NATIONAL_SIGNIFICANT_NUMBER_LENGTH = 10;

const NIGERIA_COUNTRY_CODE = "234";
const NIGERIA_TRUNK_PREFIX = "0";

/** Separators customers may type or paste. */
const SEPARATORS = /[\s\-()./]/g;

export type PhoneValidationResult = { ok: true; value: string } | { ok: false; reason: string };

function stripSeparators(input: string): string {
  return input.replace(SEPARATORS, "");
}

/**
 * Normalise a Nigerian phone number to `234XXXXXXXXX`.
 *
 * Returns a discriminated result instead of throwing, so the API boundary
 * can turn a failure into a `VALIDATION_ERROR` field detail
 * (docs/API.md §7, §40, §41).
 */
export function normaliseNigerianPhone(input: string): PhoneValidationResult {
  const raw = stripSeparators(input.trim());

  if (raw.length === 0) {
    return { ok: false, reason: "A phone number is required." };
  }

  // A single leading `+` is the international prefix; it is removed before
  // the digits-only check, not after.
  if (raw.startsWith("+")) {
    const stripped = raw.slice(1);

    if (stripped.startsWith("+")) {
      return { ok: false, reason: "A phone number may only contain one leading +." };
    }

    return parseNationalPart(stripped);
  }

  if (!/^\d+$/.test(raw)) {
    return { ok: false, reason: "A phone number may only contain digits, spaces or a leading +." };
  }

  return parseNationalPart(raw);
}

function parseNationalPart(digits: string): PhoneValidationResult {
  let national: string;

  if (digits.startsWith(NIGERIA_COUNTRY_CODE)) {
    national = digits.slice(NIGERIA_COUNTRY_CODE.length);
  } else if (digits.startsWith(NIGERIA_TRUNK_PREFIX)) {
    national = digits.slice(NIGERIA_TRUNK_PREFIX.length);
  } else {
    return {
      ok: false,
      reason: "Enter a Nigerian number, for example 08055153346 or +234805513346.",
    };
  }

  if (national.length !== NATIONAL_SIGNIFICANT_NUMBER_LENGTH) {
    return { ok: false, reason: "That does not look like a complete Nigerian phone number." };
  }

  return { ok: true, value: `${NIGERIA_COUNTRY_CODE}${national}` };
}

/**
 * True when two inputs refer to the same Nigerian number.
 * Used when matching a guest request to an existing customer record
 * (docs/ARCHITECTURE.md §15).
 */
export function isSameNigerianPhone(a: string, b: string): boolean {
  const left = normaliseNigerianPhone(a);
  const right = normaliseNigerianPhone(b);

  return left.ok && right.ok && left.value === right.value;
}
