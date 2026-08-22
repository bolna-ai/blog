import Link from "next/link";
import { getAllCategories, categorySlug } from "@/lib/posts";

export function CategoryPills({ activeSlug }: { activeSlug?: string }) {
  const categories = getAllCategories();

  return (
    <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">
      <Link
        href="/"
        className={`inline-flex items-center rounded-md border px-2 py-1 text-sm font-medium transition-all duration-200 ${
          !activeSlug
            ? "border-foreground bg-background text-foreground"
            : "border-border bg-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
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
            className={`inline-flex items-center rounded-md border px-2 py-1 text-sm font-medium transition-all duration-200 ${
              active
                ? "border-foreground bg-background text-foreground"
                : "border-border bg-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
