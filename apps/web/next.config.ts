import type { NextConfig } from "next";

/**
 * The site URL is read from the environment in `src/app/layout.tsx`
 * (`metadataBase`) so that no domain is hard-coded. See `.env.example`.
 */ const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Shared workspace packages are consumed as TypeScript source rather
   * than pre-built output, so there is no build-order coupling between
   * `apps/web` and `packages/*`.
   */
  transpilePackages: ["@forauto/config", "@forauto/types", "@forauto/ui"],

  /**
   * Fail the build on a server/client boundary violation instead of
   * silently shipping a broken component. AGENTS.md §33, §42.
   */
  typedRoutes: true,
};

export default nextConfig;
