import Image from "next/image";
import { isValidElement } from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  getAllPosts,
  getPostBySlug,
  categorySlug,
  OG_DEFAULT_SIZE,
  ogImageFor,
  type Post,
} from "@/lib/posts";
import { extractToc } from "@/lib/toc";
import { TableOfContents } from "@/components/table-of-contents";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { SITE_URL, BASE_PATH, TWITTER_HANDLE } from "@/lib/links";
import type { Metadata } from "next";
import type { Components } from "react-markdown";

// Fenced ```mermaid blocks arrive from react-markdown as
// <pre><code className="language-mermaid">...</code></pre>. Intercepting at
// the `pre` level (rather than `code`) lets a mermaid block skip the <pre>
// wrapper entirely — the CSS pre/code box styling below is meant for real
// code, not a diagram.
function getMermaidSource(children: React.ReactNode): string | null {
  const codeEl = Array.isArray(children) ? children[0] : children;
  if (!isValidElement<{ className?: string; children?: React.ReactNode }>(codeEl)) return null;
  if (!codeEl.props.className?.includes("language-mermaid")) return null;
  const raw = codeEl.props.children;
  return Array.isArray(raw) ? raw.join("") : String(raw ?? "");
}

// Heading anchors (from rehype-autolink-headings) link to "#section" within
// the same page and should stay in-tab; every other link in post bodies is
// an external reference and should open in a new tab.
const markdownComponents: Components = {
  a: ({ href, children, className }) =>
    href?.startsWith("#") ? (
      <a href={href} className={className}>
        {children}
      </a>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    ),
  // react-markdown renders inline post-body images as a plain <img>, which
  // (unlike next/image or next/link) doesn't get basePath auto-prefixed —
  // every root-relative image reference in post content needs it spelled
  // out explicitly or it 404s once the app is mounted under /blog.
  //
  // A "#card" fragment on the path marks an image that illustrates rather
  // than carries its section — a screenshot of a social post, say — and
  // renders it small instead of at full prose width. Markdown has no way to
  // size an image and this renderer strips raw HTML, so the hint rides on
  // the URL; it's stripped back off before the src is written out.
  img: ({ src, alt, className }) => {
    const path = typeof src === "string" ? src : "";
    const isCard = path.endsWith("#card");
    const cleanPath = isCard ? path.slice(0, -"#card".length) : path;
    const resolved = cleanPath.startsWith("/") ? `${BASE_PATH}${cleanPath}` : cleanPath;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? resolved : src}
        alt={alt ?? ""}
        className={[className, isCard ? "post-image-card" : null].filter(Boolean).join(" ") || undefined}
      />
    );
  },
  pre: ({ children }) => {
    const mermaidSource = getMermaidSource(children);
    if (mermaidSource) return <MermaidDiagram code={mermaidSource} />;
    return <pre>{children}</pre>;
  },
};

function AuthorTag({ post }: { post: Post }) {
  const avatar = post.authorAvatar ? (
    <Image
      src={post.authorAvatar}
      alt={post.author}
      width={40}
      height={40}
      className="rounded-full bg-foreground ring-2 ring-border"
      unoptimized
    />
  ) : (
    <div className="h-10 w-10 rounded-full bg-muted ring-2 ring-border" />
  );

  const nameBlock = (
    <div>
      <p className="font-medium text-foreground">{post.author}</p>
      <p className="text-xs text-muted-foreground">Author</p>
    </div>
  );

  if (post.authorGithub) {
    return (
      <a
        href={post.authorGithub}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-3 text-sm transition-opacity hover:opacity-80"
      >
        {avatar}
        {nameBlock}
      </a>
    );
  }

  return (
    <div className="flex items-center space-x-3 text-sm">
      {avatar}
      {nameBlock}
    </div>
  );
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${SITE_URL}/${post.slug}`,
      types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${SITE_URL}/${post.slug}`,
      siteName: "Bolna Blog",
      publishedTime: post.date,
      authors: [post.author],
      images: [socialImage(post)],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      // No per-author handles are recorded, so posts are credited to the
      // Bolna account; an authorTwitter frontmatter field could override it.
      creator: TWITTER_HANDLE,
      title: post.title,
      description: post.excerpt,
      images: [socialImage(post)],
    },
  };
}

// The card image, stated in full: dimensions and type so a scraper can lay
// the card out without fetching the file, and alt text so it isn't silent.
// Falls back to the site's default OG image for a post with no coverImage —
// an absolute URL, not a bare "/images/..." path, for the same basePath
// reason as the root layout's default image.
function socialImage(post: Post) {
  return post.coverImage
    ? {
        url: ogImageFor(post.coverImage),
        ...OG_DEFAULT_SIZE,
        type: "image/jpeg",
        alt: post.coverCaption ?? post.title,
      }
    : {
        url: `${SITE_URL}/images/og-home.png`,
        ...OG_DEFAULT_SIZE,
        type: "image/png",
        alt: "Bolna Blog",
      };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const toc = extractToc(post.content);

  return (
    <div className="mx-auto px-4 py-6 lg:py-10">
      <div className="relative flex justify-center">
        <TableOfContents items={toc} />
        <article className="w-full max-w-3xl">
          <header className="mb-12 border-b border-border pb-8">
            <div className="mb-6">
              <time dateTime={post.date} className="text-sm text-muted-foreground">
                {format(new Date(post.date), "MMMM d, yyyy")}
              </time>
              <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <a
                    key={cat}
                    href={`/blog/category/${categorySlug(cat)}`}
                    className="inline-flex items-center rounded-sm border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <AuthorTag post={post} />
            </div>
          </header>

          {post.coverImage && (
            <figure className="my-8">
            <Image
              // Next 16's image optimizer, with basePath set, resolves local
              // images by the *prefixed* path — <Image src> itself must not
              // include it (that's what the framework auto-prepends onto
              // the outer /_next/image request), but the url query param it
              // builds from src does need it, so it has to be included here.
              src={`${BASE_PATH}${post.coverImage}`}
              alt={post.title}
              width={720}
              height={405}
              className="w-full rounded-md border border-border bg-muted"
              priority
            />
            {/* Covers are archival images chosen for what they say about the
                post, which only works if the reader is told what they are. */}
            {post.coverCaption && (
              <figcaption className="mt-3 text-sm text-muted-foreground">
                {post.coverCaption}
              </figcaption>
            )}
            </figure>
          )}

          <div className="prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <hr className="mt-12 border-border" />
        </article>
      </div>
    </div>
  );
}
