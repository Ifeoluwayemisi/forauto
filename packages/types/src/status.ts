/**
 * FORauto — status vocabularies and role names.
 *
 * `AGENTS.md` §10 and §27: statuses must be defined centrally and
 * shared, never re-declared inside individual components. The values
 * below mirror the PostgreSQL enums created in
 * `database/migrations/002_enums.sql` and the contract in `docs/API.md`.
 *
 * The **allowed transitions** are not defined here. They are a backend
 * business rule validated by the API (`AGENTS.md` §6, §10) and will live
 * in `apps/api` once the service-request module is implemented.
 */

/* ── Users ────────────────────────────────────────────────────
 * docs/DATABASE.md §5
 */
export const USER_ROLES = ["CUSTOMER", "STAFF"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "SUSPENDED", "DISABLED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

/* ── Staff ────────────────────────────────────────────────────
 * docs/DATABASE.md §8, docs/API.md §4
 */
export const STAFF_ROLES = ["ADMIN", "MANAGER", "TECHNICIAN", "STAFF"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const STAFF_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type StaffStatus = (typeof STAFF_STATUSES)[number];

/* ── Service requests ─────────────────────────────────────────
 * docs/DATABASE.md §11, docs/API.md §17
 */
export const SERVICE_REQUEST_STATUSES = [
  "NEW",
  "CONTACTED",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
  "CANCELLED",
] as const;
export type ServiceRequestStatus = (typeof SERVICE_REQUEST_STATUSES)[number];

/**
 * Initial problem categories.
 *
 * `docs/DATABASE.md` §13 stores this as VARCHAR on purpose, because the
 * category system may later become database-managed. Keep the union and
 * the column in step if that changes.
 */
export const SERVICE_REQUEST_CATEGORIES = [
  "MECHANICAL",
  "ELECTRICAL",
  "DIAGNOSTICS",
  "STARTING",
  "AC",
  "BRAKES",
  "SUSPENSION",
  "STEERING",
  "COOLING",
  "SERVICING",
  "REWIRING",
  "OTHER",
] as const;
export type ServiceRequestCategory = (typeof SERVICE_REQUEST_CATEGORIES)[number];

/** docs/DATABASE.md §11 */
export const PREFERRED_TIME_PERIODS = ["MORNING", "AFTERNOON", "EVENING"] as const;
export type PreferredTimePeriod = (typeof PREFERRED_TIME_PERIODS)[number];

/** docs/DATABASE.md §11 */
export const CONTACT_PREFERENCES = ["PHONE", "WHATSAPP"] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

/* ── Appointments ─────────────────────────────────────────────
 * docs/DATABASE.md §15, docs/API.md §22
 *
 * A customer's preferred date is a REQUEST, not a confirmation
 * (`AGENTS.md` §11). `REQUESTED` is therefore a real, meaningful state.
 */
export const APPOINTMENT_STATUSES = [
  "REQUESTED",
  "CONFIRMED",
  "RESCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

/* ── Jobs ─────────────────────────────────────────────────────
 * docs/DATABASE.md §17, docs/API.md §24
 */
export const JOB_STATUSES = ["ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

/** docs/DATABASE.md §20, docs/API.md §25 */
export const ASSIGNMENT_ROLES = ["PRIMARY", "SUPPORT", "APPRENTICE", "SUPERVISOR"] as const;
export type AssignmentRole = (typeof ASSIGNMENT_ROLES)[number];

/* ── Media ────────────────────────────────────────────────────
 * docs/DATABASE.md §30
 */
export const MEDIA_VISIBILITIES = ["PRIVATE", "INTERNAL", "PUBLIC"] as const;
export type MediaVisibility = (typeof MEDIA_VISIBILITIES)[number];

/** docs/API.md §20 — the initial allow-list of upload MIME types. */
export const ALLOWED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
] as const;
export type AllowedUploadMimeType = (typeof ALLOWED_UPLOAD_MIME_TYPES)[number];

/* ── Work items (portfolio) ───────────────────────────────────
 * docs/DATABASE.md §31, docs/API.md §29
 */
export const WORK_ITEM_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number];

/* ── Authentication contexts ──────────────────────────────────
 * docs/ARCHITECTURE.md §13
 */
export type PrincipalType = "GUEST" | "CUSTOMER" | "STAFF";
