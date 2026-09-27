import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

/**
 * Typography.
 *
 * `docs/DESIGN.md` §6 nominates Manrope (display) and Inter (body) and
 * states that the final choice is locked during implementation.
 * `docs/ROADMAP.md` §6 (Phase 1 — Brand & Experience) has not run, so
 * these are provisional and must be revisited with the brand.
 *
 * `next/font` self-hosts the files, which avoids a third-party request on
 * every page load and removes an external dependency from the critical
 * rendering path (docs/ARCHITECTURE.md §52).
 */
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * The production domain is unconfirmed (docs/ROADMAP.md §16), so this
 * falls back to the documented local origin. `metadataBase` is what makes
 * Open Graph URLs and canonical URLs resolve (AGENTS.md §34).
 *
 * Read as a plain server-side variable, not a `NEXT_PUBLIC_` one: this
 * layout is a Server Component, so the value never reaches the client
 * bundle. Only `NEXT_PUBLIC_API_BASE_URL` needs to be public
 * (`AGENTS.md` §44, `.env.example`).
 */
const siteUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

/**
 * Metadata foundations (docs/ROADMAP.md §7.2).
 *
 * `title.template` gives every route a consistent suffix without repeating
 * it. Per-route titles and descriptions are added when each page is built
 * in Phase 3 — they are not invented here (AGENTS.md §8, §34).
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FORauto",
    template: "%s | FORauto",
  },
  description: "Automotive services and vehicle solutions.",
  openGraph: {
    type: "website",
    siteName: "FORauto",
    locale: "en_NG",
  },
  robots: {
    // Operational and account areas must never be indexed. Route groups
    // make this exhaustive without maintaining a manual deny-list.
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zoom must not be disabled (AGENTS.md §33, WCAG 1.4.4).
  maximumScale: 5,
  themeColor: "#111111",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-warm-white font-body text-ink antialiased">{children}</body>
    </html>
  );
}
