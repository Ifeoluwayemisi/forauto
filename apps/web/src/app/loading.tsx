/**
 * Route-level loading state (docs/ROADMAP.md §7.2, "Loading states").
 *
 * `docs/DESIGN.md` §48 requires skeletons where content shape is
 * predictable, and explicitly rejects a generic full-page spinner. The
 * page-level fallback stays deliberately quiet so a route with no real
 * skeleton of its own does not flash a spinner.
 */
export default function Loading() {
  return (
    <main
      className="mx-auto flex min-h-dvh max-w-content flex-col justify-center gap-4 px-5 py-16 sm:px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <div className="h-3 w-28 animate-pulse rounded-control bg-stone" />
      <div className="h-9 w-64 max-w-full animate-pulse rounded-control bg-stone" />
      <div className="h-4 w-full max-w-prose animate-pulse rounded-control bg-stone" />
    </main>
  );
}
