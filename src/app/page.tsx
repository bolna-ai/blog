import { Rss } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { CategoryPills } from "@/components/category-pills";
import { PostFeed } from "@/components/post-feed";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      <section className="relative pb-16 pt-8">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="my-6 flex items-center justify-center gap-3">
            <h1 className="font-heading text-5xl font-semibold tracking-tight lg:text-6xl">
              Blog
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
            Engineering notes and product updates from the team building Bolna&rsquo;s voice AI infrastructure.
          </p>
          <CategoryPills />
        </div>
      </section>

      <PostFeed posts={posts} />
    </div>
  );
}
