import Link from "next/link";

/**
 * 404 page.
 *
 * `docs/USER_FLOWS.md` Rule 7: no dead ends. Every unsuccessful
 * navigation must answer "what happens now?" and offer a way forward.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-content flex-col justify-center gap-4 px-5 py-16 sm:px-6">
      <p className="font-mono text-xs tracking-[0.2em] text-ink-muted uppercase">404</p>
      <h1 className="font-display text-2xl font-bold text-balance sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-prose text-ink-secondary">
        The page may have moved, or the link may be out of date.
      </p>
      <div>
        <Link
          href="/"
          className="inline-block rounded-button bg-amber px-5 py-3 font-medium text-charcoal transition-opacity hover:opacity-90"
        >
          Back to FORauto
        </Link>
      </div>
    </main>
  );
}
