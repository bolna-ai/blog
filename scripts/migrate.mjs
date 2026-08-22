// One-off migration script: pulls all posts from the WordPress-hosted
// blog.bolna.ai and writes them out as local MDX files + downloaded images.
// Run with: node scripts/migrate.mjs
import fs from "node:fs";
import path from "node:path";
import TurndownService from "turndown";

const WP_BASE = "https://blog.bolna.ai/wp-json/wp/v2";
const CONTENT_DIR = path.join(process.cwd(), "content", "posts");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "posts");

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Strip WordPress's auto-injected table-of-contents block; the new site
// generates its own nav from headings, and Gutenberg image `<figure>` blocks
// pass through fine but the ToC block turndown mangles into a huge link list.
turndown.remove("nav");

async function fetchAllPaged(endpoint) {
  const items = [];
  let page = 1;
  for (;;) {
    const res = await fetch(`${WP_BASE}${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100&page=${page}`);
    if (res.status === 400) break; // past last page
    if (!res.ok) throw new Error(`${endpoint} page ${page}: ${res.status}`);
    const batch = await res.json();
    if (!batch.length) break;
    items.push(...batch);
    const totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
    if (page >= totalPages) break;
    page++;
  }
  return items;
}

const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–",
};

function decodeHtmlEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] ?? m);
}

async function downloadImage(url, destDir) {
  try {
    const filename = path.basename(new URL(url).pathname).split("?")[0] || "image.jpg";
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, filename);
    if (fs.existsSync(dest)) return filename;
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return filename;
  } catch {
    return null;
  }
}

function escapeFrontmatterString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function main() {
  console.log("Fetching categories, users, posts...");
  const [categories, users, posts] = await Promise.all([
    fetchAllPaged("/categories"),
    fetchAllPaged("/users"),
    fetchAllPaged("/posts?_embed=1"),
  ]);

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const userById = new Map(users.map((u) => [u.id, u]));

  console.log(`Found ${posts.length} posts. Migrating...`);

  const manifest = [];

  for (const post of posts) {
    const slug = post.slug;
    const postImageDir = path.join(IMAGES_DIR, slug);
    let markdown = turndown.turndown(post.content.rendered).replace(/\\+$/gm, "");

    // Rewrite any blog.bolna.ai wp-content image URLs to local copies.
    const imageUrls = [...markdown.matchAll(/!\[[^\]]*\]\((https:\/\/blog\.bolna\.ai\/wp-content\/uploads\/[^)\s]+)\)/g)].map((m) => m[1]);
    const uniqueImageUrls = [...new Set(imageUrls)];
    const urlToLocal = new Map();
    for (const url of uniqueImageUrls) {
      const filename = await downloadImage(url, postImageDir);
      if (filename) {
        urlToLocal.set(url, `/images/posts/${slug}/${filename}`);
      }
    }
    for (const [url, local] of urlToLocal) {
      markdown = markdown.split(url).join(local);
    }

    // Featured/cover image
    let coverImage = "";
    const media = post._embedded?.["wp:featuredmedia"]?.[0];
    const featuredUrl = media?.source_url;
    if (featuredUrl) {
      if (urlToLocal.has(featuredUrl)) {
        coverImage = urlToLocal.get(featuredUrl);
      } else {
        const filename = await downloadImage(featuredUrl, postImageDir);
        if (filename) coverImage = `/images/posts/${slug}/${filename}`;
      }
    }

    const postCategories = (post.categories || [])
      .map((id) => categoryById.get(id)?.name)
      .filter(Boolean)
      .map((name) => decodeHtmlEntities(name))
      .filter((name) => name !== "Uncategorized");
    const authorUser = userById.get(post.author);
    const author = decodeHtmlEntities(authorUser?.name || "Bolna Team");
    const authorAvatar = authorUser?.avatar_urls?.["96"] || "";
    const excerpt = decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]+>/g, ""))
      .replace(/\[…\]/g, "…")
      .trim();

    const dateISO = post.date_gmt.endsWith("Z") ? post.date_gmt : `${post.date_gmt}Z`;

    const frontmatter = [
      "---",
      `title: "${escapeFrontmatterString(decodeHtmlEntities(post.title.rendered))}"`,
      `slug: "${slug}"`,
      `date: "${dateISO}"`,
      `author: "${escapeFrontmatterString(author)}"`,
      authorAvatar ? `authorAvatar: "${authorAvatar}"` : null,
      `categories: [${postCategories.map((c) => `"${escapeFrontmatterString(c)}"`).join(", ")}]`,
      `excerpt: "${escapeFrontmatterString(excerpt)}"`,
      coverImage ? `coverImage: "${coverImage}"` : null,
      `sourceUrl: "${post.link}"`,
    ]
      .filter(Boolean)
      .join("\n");

    fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), `${frontmatter}\n---\n\n${markdown.trim()}\n`);
    manifest.push({ slug, title: post.title.rendered, categories: postCategories });
    console.log(`  ✓ ${slug}`);
  }

  console.log(`\nDone. Wrote ${manifest.length} MDX files to content/posts/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
