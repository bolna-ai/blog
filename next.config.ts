import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/links";

const nextConfig: NextConfig = {
  // Canonical URL is now bolna.ai/blog (a path on the main site, not its own
  // subdomain) — this makes every internal Link/Image/route in the app
  // resolve under /blog automatically. The main bolna.ai app rewrites
  // /blog/:path* to this app's own deployment with the /blog prefix intact.
  //
  // Known Next 16 quirk: with basePath set, the local image optimizer
  // resolves images by the *basePath-prefixed* path, but <Image src> must
  // stay unprefixed (that's what the framework auto-prepends onto the
  // outer /_next/image request) — so every local <Image src> in this app
  // manually prefixes with BASE_PATH to route around it. See the comments
  // on those Image usages if this ever needs revisiting.
  basePath: BASE_PATH,
  // Cleanup for URLs that existed on the old WordPress-hosted blog.bolna.ai
  // but have no direct equivalent here — everything else (posts, categories)
  // now shares the exact same URL shape as the old site, so no redirect is
  // needed for those; Next.js's default trailing-slash normalization (308)
  // handles WordPress's trailing-slash permalinks automatically. Cross-
  // checked against a full crawl of blog.bolna.ai's actually-indexed URLs,
  // not just the sitemap, to catch archive types the sitemap omits
  // (author pages, tag pages, various /feed/ endpoints).
  async redirects() {
    return [
      // WordPress pagination ("Uncategorized" has no equivalent category
      // page here either, and archive pagination has nothing to point at).
      { source: "/page/:num", destination: "/", permanent: true },
      { source: "/category/uncategorized", destination: "/", permanent: true },
      // Two category slugs that never had real content and already
      // 404 on the live WordPress site — cleaned up for consistency
      // rather than left as dangling broken links.
      { source: "/category/archives", destination: "/", permanent: true },
      { source: "/category/news", destination: "/", permanent: true },
      // Old Rank Math sitemap file names.
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      // WordPress author archive pages (and their pagination) — no
      // equivalent concept here.
      { source: "/author/:slug", destination: "/", permanent: true },
      { source: "/author/:slug/page/:num", destination: "/", permanent: true },
      // Tag archive pages — already 404ing on the live WordPress site
      // today (pre-existing, not a regression), so this is just cleanup
      // rather than carrying forward a broken URL shape indefinitely.
      { source: "/tag/:slug*", destination: "/", permanent: true },
      // RSS/comment feed endpoints.
      { source: "/feed", destination: "/rss.xml", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
      { source: "/category/:slug/feed", destination: "/category/:slug", permanent: true },
      { source: "/:slug/feed", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
