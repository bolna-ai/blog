# Bolna Blog

Bolna's blog, rebuilt on Next.js. Content is plain Markdown, no CMS.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Posts are Markdown files in `content/posts/*.mdx`, statically generated
- `next-themes` for light/dark, `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
```

## Adding or editing a post

Create/edit `content/posts/<slug>.mdx`:

```md
---
title: "Post title"
slug: "post-slug"
date: "2026-08-19T00:00:00Z"
author: "Author Name"
categories: ["Engineering"]
excerpt: "One-line summary."
coverImage: "/images/posts/post-slug/cover.png"   # optional
---

Body content in Markdown.
```

Images go in `public/images/posts/<slug>/`.

## Migration scripts

- `scripts/migrate.mjs` — pulls posts from the old WordPress blog's REST API. Re-run if new posts appear there before it's decommissioned.
- `scripts/migrate-builders.mjs` — pulls posts from bolna.ai's Builders blog.

## Deployment

Canonical URL: `bolna.ai/blog`. This app has `basePath: "/blog"` set (`next.config.ts`), so every internal link/image/route resolves under `/blog` automatically. The main bolna.ai app needs a rewrite (`/blog/:path* → https://<this-app>/blog/:path*`) to serve it at that path, and `blog.bolna.ai` should 301-redirect into `bolna.ai/blog` rather than serve content itself.

`SITE_URL` (in `src/lib/links.ts`) is the single source of truth for the canonical domain — change it there if it ever moves again. Plain `<a>` tags (a few RSS/nav links) don't get `basePath` auto-prefixing the way `next/link` does, so those are written out explicitly rather than relying on it.

Old WordPress URLs with no equivalent here (pagination, old sitemap filenames) are redirected in `next.config.ts`.
