export const SLACK_INVITE_URL =
  "https://join.slack.com/t/bolnabuilders/shared_invite/zt-42zi57jyd-3yt1XDWq3kWBLj1puqq2fQ";

// Single source of truth for the app's basePath (also used by
// next.config.ts). basePath only auto-prefixes next/link, next/image, and
// the Metadata API — plain <a>/<img> tags (raw anchors, and any <img> that
// comes from react-markdown rendering an inline image in a post body) don't
// get it, so those need this spelled out explicitly.
export const BASE_PATH = "/blog";

// Canonical home of the blog. Single source of truth so it only needs
// updating in one place if it ever moves again.
// www is the canonical form for the main site (its own sitemap generator
// hardcodes BASE_URL = 'https://www.bolna.ai', and the bare bolna.ai apex
// redirects there) — matching it here avoids a canonical mismatch even
// though the bare-apex path would still resolve via that redirect.
export const SITE_URL = `https://www.bolna.ai${BASE_PATH}`;

export const RSS_PATH = `${BASE_PATH}/rss.xml`;
