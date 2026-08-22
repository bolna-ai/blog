import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategories, categorySlug } from "@/lib/posts";
import { SITE_URL } from "@/lib/links";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const latestDate = posts[0]?.date ? new Date(posts[0].date) : new Date();

  return [
    {
      url: SITE_URL,
      lastModified: latestDate,
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((cat) => ({
      url: `${SITE_URL}/category/${categorySlug(cat)}`,
      lastModified: latestDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
