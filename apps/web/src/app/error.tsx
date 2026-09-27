"use client";

/**
 * Route-level error boundary (docs/ROADMAP.md §7.2, "Error boundaries").
 *
 * `docs/DESIGN.md` §47: errors must be human, specific and actionable.
 * "Error 500" is not acceptable copy. The customer is offered the two
 * channels FORauto actually uses — WhatsApp and phone — rather than a
 * dead end (AGENTS.md §25, docs/USER_FLOWS.md Rule 7).
 *
 * The business contact details are intentionally absent. They are
 * unconfirmed (docs/ROADMAP.md §5) and must never be invented
 * (AGENTS.md §8); they are wired in Phase 3 from the environment.
 */

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Error monitoring is a Phase 6 concern (docs/ROADMAP.md §16). Until a
    // provider exists, the message goes to the browser console rather than
    // being silently dropped (AGENTS.md §24).
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-content flex-col justify-center gap-4 px-5 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-balance sm:text-3xl">
        We couldn&apos;t load this page
      </h1>
      <p className="max-w-prose text-ink-secondary">
        Something went wrong on our side. Please try again, or contact us directly and we&apos;ll
        help.
      </p>
      <div>
        <button
          type="button"
          onClick={reset}
          className="rounded-button bg-amber px-5 py-3 font-medium text-charcoal transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
