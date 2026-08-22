import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { Post } from "@/lib/posts";

export function PostFeed({ posts }: { posts: Post[] }) {
  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No posts here yet.
      </p>
    );
  }

  return (
    <section className="relative z-20 py-8">
      <div className="mb-16">
        <article className="group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-foreground/5 to-transparent shadow-sm transition-shadow">
          <div className="absolute right-4 top-4 z-10">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              Latest
            </span>
          </div>
          <div className={`grid gap-8 ${featured.coverImage ? "lg:grid-cols-2" : ""}`}>
            {featured.coverImage && (
              <div className="relative aspect-4/3 overflow-hidden lg:aspect-auto">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <time dateTime={featured.date} className="text-sm text-muted-foreground">
                  {format(new Date(featured.date), "MMMM d, yyyy")}
                </time>
                <div className="flex flex-wrap gap-2">
                  {featured.categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center rounded-sm border border-border px-2 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="mb-4 text-3xl font-bold leading-tight transition-opacity group-hover:opacity-80">
                {featured.title}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {featured.excerpt}
              </p>
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                <span>Read full article</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
          <Link
            href={`/${featured.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          >
            <span className="sr-only">Read {featured.title}</span>
          </Link>
        </article>
      </div>

      {rest.length > 0 && (
        <div>
          <h3 className="mb-8 font-heading text-2xl font-semibold">More Articles</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-linear-to-br from-foreground/5 to-transparent shadow-sm"
              >
                {post.coverImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <time dateTime={post.date} className="text-sm text-muted-foreground">
                      {format(new Date(post.date), "MMMM d, yyyy")}
                    </time>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center rounded-sm border border-border px-2 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 className="mb-3 text-xl font-semibold leading-tight transition-opacity group-hover:opacity-80">
                    {post.title}
                  </h2>
                  <p className="flex-1 leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <span className="font-semibold">Read more</span>
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                <Link
                  href={`/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                >
                  <span className="sr-only">Read {post.title}</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
