export const SLACK_INVITE_URL =
  "https://join.slack.com/t/bolnabuilders/shared_invite/zt-42zi57jyd-3yt1XDWq3kWBLj1puqq2fQ";

// Canonical home of the blog. Single source of truth so it only needs
// updating in one place if it ever moves again.
export const SITE_URL = "https://bolna.ai/blog";

// basePath ("/blog") only auto-prefixes next/link and the Metadata API —
// plain <a> tags don't get it, so this needs to be spelled out explicitly
// anywhere an RSS link is a raw anchor.
export const RSS_PATH = "/blog/rss.xml";
