import { notFound } from "next/navigation";
import { Rss } from "lucide-react";
import { getAllPosts, getAllCategories, getCategoryBySlug, categorySlug } from "@/lib/posts";
import { CategoryPills } from "@/components/category-pills";
import { PostFeed } from "@/components/post-feed";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllCategories().map((cat) => ({ slug: categorySlug(cat) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category,
    description: `Posts filed under ${category} on the Bolna Blog.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getAllPosts().filter((p) => p.categories.includes(category));

  return (
    <div>
      <section className="relative pb-16 pt-8">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="my-6 flex items-center justify-center gap-3">
            <h1 className="font-heading text-5xl font-semibold tracking-tight lg:text-6xl">
              {category}
            </h1>
            <a
              className="text-muted-foreground transition-colors hover:text-primary"
              title="RSS Feed"
              href="/rss.xml"
            >
              <Rss className="h-8 w-8" />
              <span className="sr-only">RSS Feed</span>
            </a>
          </div>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Posts filed under {category}.
          </p>
          <CategoryPills activeSlug={slug} />
        </div>
      </section>

      <PostFeed posts={posts} />
    </div>
  );
}
