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
    <footer className="border-t border-surface-dark-hover bg-surface-dark text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 flex items-start md:col-span-1">
            <BolnaLogo height={26} onDark />
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="type-caption mb-4 text-text-subtle">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => {
                  const external = link.href !== "/blog";
                  return (
                    <li key={link.label}>
                      <a
                        className="type-sm text-white transition-colors hover:text-text-subtle"
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
        <div className="flex flex-col items-center justify-between border-t border-surface-dark-hover pt-6 md:flex-row">
          <p className="type-xs text-text-subtle">
            © {new Date().getFullYear()} Bolna
          </p>
          <a
            href={RSS_PATH}
            className="type-xs mt-3 text-text-subtle transition-colors hover:text-white md:mt-0"
          >
            RSS Feed
          </a>
        </div>
      </div>
    </footer>
  );
}
