import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  author: string;
  authorAvatar?: string;
  authorGithub?: string;
  categories: string[];
  excerpt: string;
  coverImage?: string;
  sourceUrl?: string;
};

export type Post = PostMeta & {
  content: string;
};

function readSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(): Post[] {
  return readSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    title: data.title,
    slug: data.slug ?? slug,
    date: data.date,
    author: data.author,
    authorAvatar: data.authorAvatar,
    authorGithub: data.authorGithub,
    categories: data.categories ?? [],
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage,
    sourceUrl: data.sourceUrl,
    content,
  };
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  for (const post of getAllPosts()) {
    for (const c of post.categories) set.add(c);
  }
  return [...set].sort();
}

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getCategoryBySlug(slug: string): string | null {
  return getAllCategories().find((cat) => categorySlug(cat) === slug) ?? null;
}
