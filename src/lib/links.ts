export const SLACK_INVITE_URL =
  "https://join.slack.com/t/bolnabuilders/shared_invite/zt-42zi57jyd-3yt1XDWq3kWBLj1puqq2fQ";

// Canonical home of the blog. Single source of truth so it only needs
// updating in one place if it ever moves again.
// www is the canonical form for the main site (its own sitemap generator
// hardcodes BASE_URL = 'https://www.bolna.ai', and the bare bolna.ai apex
// redirects there) — matching it here avoids a canonical mismatch even
// though the bare-apex path would still resolve via that redirect.
export const SITE_URL = "https://www.bolna.ai/blog";

// basePath ("/blog") only auto-prefixes next/link and the Metadata API —
// plain <a> tags don't get it, so this needs to be spelled out explicitly
// anywhere an RSS link is a raw anchor.
export const RSS_PATH = "/blog/rss.xml";
