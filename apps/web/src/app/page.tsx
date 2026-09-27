/**
 * Foundation placeholder — NOT the FORauto homepage.
 *
 * The homepage is Phase 3 work (docs/ROADMAP.md §8.2) and depends on
 * business information that is still unconfirmed: the real service
 * catalogue, workshop photography, opening hours, phone and WhatsApp
 * number (docs/ROADMAP.md §5, §16). Building it now would require
 * inventing that content, which `AGENTS.md` §7 and §8 forbid.
 *
 * Next.js requires a root page for the app to build at all, so this
 * renders an honest "foundation only" state instead of a mock homepage.
 * Replace it when Phase 3 begins.
 */
export default function PlaceholderPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-content flex-col justify-center gap-4 px-5 py-16 sm:px-6">
      <p className="font-mono text-xs tracking-[0.2em] text-ink-muted uppercase">
        Technical foundation
      </p>
      <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        FORauto
      </h1>
      <p className="max-w-prose text-ink-secondary">
        The application foundation is in place. The public website has not been built yet.
      </p>
    </main>
  );
}
