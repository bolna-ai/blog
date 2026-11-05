import { ThemeToggle } from "./theme-toggle";
import { BolnaLogo } from "./bolna-logo";
import {
  CONTACT_SALES_URL,
  LOGIN_URL,
  MAIN_SITE_URL,
  NAV_LINKS,
} from "@/lib/links";

const linkClass =
  "inline-flex h-10 items-center rounded-lg px-3 text-base font-medium text-foreground transition-colors hover:bg-muted";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-(--nav-bg) text-foreground backdrop-blur-lg">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <a href={MAIN_SITE_URL} className="inline-flex shrink-0 items-center">
            <BolnaLogo height={26} />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <a href={LOGIN_URL} className="btn btn-secondary">
              Login
            </a>
            <a href={CONTACT_SALES_URL} className="btn btn-primary">
              Contact Sales
            </a>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <details className="group relative">
              <summary
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border marker:hidden hover:bg-muted [&::-webkit-details-marker]:hidden"
                aria-label="Menu"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path className="group-open:hidden" d="M2 5h14M2 9h14M2 13h14" />
                  <path className="hidden group-open:block" d="M4 4l10 10M14 4L4 14" />
                </svg>
              </summary>
              <div className="fixed inset-x-0 top-[72px] max-h-[calc(100vh-72px)] overflow-auto border-b border-border bg-background px-5 pb-6 pt-2">
                <div className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <a key={link.label} href={link.href} className="border-b border-border py-4 text-lg">
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <a href={LOGIN_URL} className="btn btn-secondary">
                    Login
                  </a>
                  <a href={CONTACT_SALES_URL} className="btn btn-primary">
                    Contact Sales
                  </a>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
