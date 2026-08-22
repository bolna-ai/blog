import GithubSlugger from "github-slugger";

export type TocItem = { id: string; text: string };

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .trim();
}

/**
 * Pulls out "## " headings for the post's table of contents. Slugs are
 * generated with the same library rehype-slug uses under the hood, so
 * these ids match the actual heading ids ReactMarkdown renders.
 */
export function extractToc(markdown: string): TocItem[] {
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "");
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  for (const line of withoutCodeBlocks.split("\n")) {
    const match = line.match(/^##(?!#)\s+(.*)$/);
    if (!match) continue;
    const text = stripInlineMarkdown(match[1]);
    if (!text) continue;
    items.push({ id: slugger.slug(text), text });
  }

  return items;
}
