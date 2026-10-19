import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/links";

// llms.txt (https://llmstxt.org): a plain-text index of every post for AI
// crawlers and answer engines. Built from frontmatter, so new posts show up
// on the next deploy without editing this file.
export function GET() {
  const posts = getAllPosts();

  const lines = posts.map(
    (post) =>
      `- [${post.title}](${SITE_URL}/${post.slug}): ${post.description ?? post.excerpt}`
  );

  const body = `# Bolna Blog

> Engineering notes, product updates and guides from the team building Bolna, a voice AI agent platform for Indian languages.

- Main site: https://www.bolna.ai
- Docs: https://www.bolna.ai/docs
- RSS: ${SITE_URL}/rss.xml

## Posts

${lines.join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
