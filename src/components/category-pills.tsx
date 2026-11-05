import Link from "next/link";
import { getAllCategories, categorySlug } from "@/lib/posts";

export function CategoryPills({ activeSlug }: { activeSlug?: string }) {
  const categories = getAllCategories();

  return (
    <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
      <Link
        href="/"
        className={`inline-flex items-center rounded-pill border px-4 py-1.5 text-base font-medium transition-colors duration-200 ${
          !activeSlug
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-transparent text-foreground hover:bg-muted"
        }`}
      >
        All Posts
      </Link>
      {categories.map((cat) => {
        const slug = categorySlug(cat);
        const active = activeSlug === slug;
        return (
          <Link
            key={cat}
            href={`/category/${slug}`}
            className={`inline-flex items-center rounded-pill border px-4 py-1.5 text-base font-medium transition-colors duration-200 ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
