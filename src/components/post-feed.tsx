import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { BASE_PATH } from "@/lib/links";
import type { Post } from "@/lib/posts";

export function PostFeed({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="type-lg py-16 text-center text-muted-foreground">
        No posts here yet.
      </p>
    );
  }

  return (
    <section className="relative z-20 pb-(--section-py)">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-border bg-card"
          >
            <div className="relative h-[206px] overflow-hidden bg-muted md:h-[317px]">
              {post.coverImage && (
                <Image
                  // See the comment on the equivalent Image in [slug]/page.tsx —
                  // the local image optimizer needs this pre-prefixed.
                  src={`${BASE_PATH}${post.coverImage}`}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index < 2}
                />
              )}
              {index === 0 && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-pill bg-white px-3 py-1 text-sm font-medium text-surface-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Latest
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 px-[26px] pb-[26px] pt-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <time dateTime={post.date} className="type-sm text-muted-foreground">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </time>
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center rounded-pill border border-border px-3 py-0.5 text-sm font-medium text-muted-foreground"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h2 className="type-h6 font-heading text-foreground">
                {post.title}
              </h2>
              <p className="type-lg flex-1 text-muted-foreground">
                {post.excerpt}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-base font-medium text-foreground">
                Read
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
            <Link
              href={`/${encodeURIComponent(post.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
            >
              <span className="sr-only">Read {post.title}</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
