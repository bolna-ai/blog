// Migrates the handful of posts that live on bolna.ai's own "Builders" blog
// (a separate Next.js app, not the WordPress blog.bolna.ai) rather than
// pulling from a paginated API like migrate.mjs does.
import fs from "node:fs";
import path from "node:path";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.use(gfm);

// The Builders blog page doesn't reliably link every author's name to their
// GitHub profile in the markup (Mujeer's isn't linked there at all), so this
// is hand-verified ground truth rather than scraped.
const AUTHOR_GITHUB = {
  "Dabbu Mothsera": "lazerbeam47",
  Sanket: "san0808",
  "Mujeer Ahmed": "MujeerAhmed",
};

const POSTS = [
  {
    url: "https://www.bolna.ai/builders/blog/when-one-provider-combo-goes-down-thousands-of-calls-suffer-here-s-how-to-catch-it-in-30-minutes",
    slug: "when-one-provider-combo-goes-down",
  },
  {
    url: "https://www.bolna.ai/builders/blog/how-we-reduced-tcp-connections-across-our-voice-ai-fleet-without-adding-more-servers",
    slug: "reduced-tcp-connections-voice-ai-fleet",
  },
  {
    url: "https://www.bolna.ai/builders/blog/cutting-per-pod-memory-with-gunicorn-preload-and-copy-on-write",
    slug: "cutting-per-pod-memory-gunicorn-preload",
  },
];

function decodeHtmlEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeFrontmatterString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function parseDate(raw) {
  // Handles both "2026-07-27" and "Jul 27, 2026"
  const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}$/);
  const d = isoMatch ? new Date(`${raw}T00:00:00Z`) : new Date(raw);
  return d.toISOString();
}

async function main() {
  for (const { url, slug } of POSTS) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    const html = await res.text();

    const titleMatch = html.match(/<title>([^<]*?)\s*·\s*Built with Bolna<\/title>/);
    const title = decodeHtmlEntities(titleMatch[1]);

    const articleStart = html.indexOf("<article");
    const articleEnd = html.indexOf("</article>");
    const articleHtml = html.slice(articleStart, articleEnd);

    const categoryMatch = articleHtml.match(/<span class="rounded-full[^>]*>([^<]*)<\/span>/);
    const category = categoryMatch ? decodeHtmlEntities(categoryMatch[1]) : "General";

    const dateMatch = articleHtml.match(/text-xs" style="color: var\(--ink-3\)">([^<]*)<\/span>/);
    const [dateRaw] = dateMatch[1].split("·").map((s) => s.trim());
    const date = parseDate(dateRaw);

    const authorMatch = articleHtml.match(/font-\[var\(--fontd\)\][^>]*font-bold[^>]*>([^<]*)<\/span>/);
    const author = authorMatch ? decodeHtmlEntities(authorMatch[1].trim()) : "Bolna Team";
    const githubUser = AUTHOR_GITHUB[author];
    const authorGithub = githubUser ? `https://github.com/${githubUser}` : null;
    const authorAvatar = githubUser ? `https://github.com/${githubUser}.png` : null;

    const bodyStart = articleHtml.indexOf('class="article-body');
    const bodyInnerStart = articleHtml.indexOf("<!---->", bodyStart) + "<!---->".length;
    const bodyEnd = articleHtml.indexOf("<!----></div>", bodyInnerStart);
    let bodyHtml = articleHtml.slice(bodyInnerStart, bodyEnd);

    // One post has a malformed image reference in the source (author wrote
    // "![Dashboard showing ...]" without the actual image, which rendered as
    // literal "!<caption>" text immediately followed by a duplicate caption
    // paragraph). Collapse that pattern into a single italicized caption.
    bodyHtml = bodyHtml.replace(/<p>!([^<]+)<\/p>\s*<p>\1<\/p>/g, "<p><em>$1</em></p>");

    let markdown = turndown.turndown(bodyHtml).replace(/\\+$/gm, "");

    const firstParagraph = bodyHtml.match(/<p>(.*?)<\/p>/s);
    const excerptSource = firstParagraph
      ? decodeHtmlEntities(firstParagraph[1].replace(/<[^>]+>/g, ""))
      : title;
    const excerpt =
      excerptSource.length > 160 ? `${excerptSource.slice(0, 160).trim()}…` : excerptSource;

    const frontmatter = [
      "---",
      `title: "${escapeFrontmatterString(title)}"`,
      `slug: "${slug}"`,
      `date: "${date}"`,
      `author: "${escapeFrontmatterString(author)}"`,
      authorGithub ? `authorGithub: "${authorGithub}"` : null,
      authorAvatar ? `authorAvatar: "${authorAvatar}"` : null,
      `categories: ["${escapeFrontmatterString(category)}"]`,
      `excerpt: "${escapeFrontmatterString(excerpt)}"`,
      `sourceUrl: "${url}"`,
    ]
      .filter(Boolean)
      .join("\n");

    fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), `${frontmatter}\n---\n\n${markdown.trim()}\n`);
    console.log(`  ✓ ${slug}`);
  }
  console.log(`\nDone. Wrote ${POSTS.length} MDX files to content/posts/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
