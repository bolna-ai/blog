import { BolnaLogo } from "./bolna-logo";
import { SLACK_INVITE_URL, RSS_PATH } from "@/lib/links";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Agents", href: "https://www.bolna.ai/agents" },
      { label: "Pricing", href: "https://www.bolna.ai/pricing" },
      { label: "Docs", href: "https://www.bolna.ai/docs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Newsroom", href: "https://www.bolna.ai/newsroom" },
      { label: "Platform", href: "https://platform.bolna.ai" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Slack Community", href: SLACK_INVITE_URL },
      { label: "X / Twitter", href: "https://x.com/bolna_dev" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/bolna-ai/" },
      { label: "YouTube", href: "https://www.youtube.com/@BolnaVoiceAI" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background pt-8">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-start text-foreground">
            <BolnaLogo className="h-10 w-auto" />
            <span className="sr-only">Bolna</span>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => {
                  const external = link.href !== "/blog";
                  return (
                    <li key={link.label}>
                      <a
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bolna
          </p>
          <a
            href={RSS_PATH}
            className="mt-3 text-xs text-muted-foreground transition-colors hover:text-foreground md:mt-0"
          >
            RSS Feed
          </a>
        </div>
      </div>
    </footer>
  );
}
