import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { BolnaLogo } from "./bolna-logo";
import { SLACK_INVITE_URL } from "@/lib/links";

const NAV_LINKS = [
  { href: "https://www.bolna.ai", label: "Home" },
  { href: "https://www.bolna.ai/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "https://www.bolna.ai/pricing", label: "Pricing" },
];

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/50 text-foreground backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="flex flex-1 items-center">
            <Link href="/" className="inline-flex items-center text-foreground">
              <BolnaLogo className="h-9 w-auto" />
              <span className="sr-only">Bolna</span>
            </Link>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="flex items-baseline space-x-5">
              {NAV_LINKS.map((link) => {
                const external = link.label !== "Blog";
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={`inline-flex h-8 items-center self-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-foreground/10 ${
                      link.label === "Blog" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="hidden flex-1 items-center justify-end space-x-4 lg:flex">
            <ThemeToggle />
            <a
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="https://x.com/bolna_dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">X / Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="https://www.linkedin.com/company/bolna-ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">LinkedIn</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124M7.114 20.452H3.558V9h3.556zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
              </svg>
            </a>
            <a
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={SLACK_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Join the Bolna Builders Slack community"
            >
              <span className="sr-only">Join the Bolna Builders Slack community</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
            </a>
            <a href="https://platform.bolna.ai/" target="_blank" rel="noopener noreferrer">
              <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Experience Bolna
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
