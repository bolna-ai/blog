import { Rss } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { CategoryPills } from "@/components/category-pills";
import { PostFeed } from "@/components/post-feed";
import { RSS_PATH } from "@/lib/links";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      <section className="relative px-0 pb-12 pt-(--section-py)">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <h1 className="type-h1 font-heading">
              Blog
            </h1>
            <a
              className="text-muted-foreground transition-colors hover:text-primary"
              title="RSS Feed"
              href={RSS_PATH}
            >
              <Rss className="h-7 w-7" />
              <span className="sr-only">RSS Feed</span>
            </a>
          </div>
          <p className="type-lg mx-auto mb-10 max-w-xl text-muted-foreground">
            Engineering notes and product updates from the team building Bolna&rsquo;s voice AI infrastructure.
          </p>
          <CategoryPills />
        </div>
      </section>

      <PostFeed posts={posts} />
    </div>
  );
}
