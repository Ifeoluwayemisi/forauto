/**
 * FORauto — shared runtime constants.
 *
 * Anything here must be justified by a document in `docs/`.
 *
 * NOTE: business contact details (phone, WhatsApp, opening hours) are
 * deliberately NOT defined here. They are unconfirmed
 * (`docs/ROADMAP.md` §5, §16) and `AGENTS.md` §8 forbids inventing
 * them, so a hard-coded constant would be a fabrication. Read them
 * from the environment at the point of use instead — see
 * `.env.example`.
 */

/**
 * Absolute path prefix for every versioned REST route.
 * `docs/API.md` §2.3.
 */
export const API_VERSION_PREFIX = "/api/v1";

/**
 * Timezone of the workshop, used for all operational date handling.
 * `docs/API.md` §42 requires the workshop's local timezone to be
 * handled explicitly.
 */
export const WORKSHOP_TIMEZONE = "Africa/Lagos";
