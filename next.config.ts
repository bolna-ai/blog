import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cleanup for URLs that existed on the old WordPress-hosted blog.bolna.ai
  // but have no direct equivalent here — everything else (posts, categories)
  // now shares the exact same URL shape as the old site, so no redirect is
  // needed for those; Next.js's default trailing-slash normalization (308)
  // handles WordPress's trailing-slash permalinks automatically.
  async redirects() {
    return [
      // WordPress pagination ("Uncategorized" has no equivalent category
      // page here either, and archive pagination has nothing to point at).
      { source: "/page/:num", destination: "/", permanent: true },
      { source: "/category/uncategorized", destination: "/", permanent: true },
      // Old Rank Math sitemap file names.
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
};

export default nextConfig;
