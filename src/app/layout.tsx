import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/links";
import { OG_DEFAULT_SIZE } from "@/lib/posts";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans-family",
  subsets: ["latin"],
});

const heading = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
});

const OG_IMAGE = {
  url: `${SITE_URL}/images/og-home.png`,
  ...OG_DEFAULT_SIZE,
  type: "image/png",
  alt: "Bolna Blog",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bolna Blog — Voice AI for India",
    template: "%s — Bolna Blog",
  },
  description:
    "Engineering notes, product updates, and case studies from the team building Bolna's real-time voice AI infrastructure for calls, telephony, and LLMs.",
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
  openGraph: {
    title: "Bolna Blog — Voice AI for India",
    description:
      "Engineering notes, product updates, and case studies from the team building Bolna's real-time voice AI infrastructure for calls, telephony, and LLMs.",
    url: SITE_URL,
    siteName: "Bolna Blog",
    type: "website",
    // Absolute URL, not a bare "/images/..." path — with basePath set, a
    // leading-slash relative URL resolves against metadataBase's origin and
    // drops the /blog prefix (same gotcha documented in next.config.ts).
    // Dimensions and type are stated so a social scraper can lay the card
    // out without fetching and measuring the file first.
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolna Blog — Voice AI for India",
    description:
      "Engineering notes, product updates, and case studies from the team building Bolna's real-time voice AI infrastructure for calls, telephony, and LLMs.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${heading.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <main className="mx-auto w-full max-w-7xl flex-1 px-6">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
