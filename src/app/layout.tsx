import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/links";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans-family",
  subsets: ["latin"],
});

const heading = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Voice AI Engineering & Product Updates — Bolna Blog",
    template: "%s — Bolna Blog",
  },
  description:
    "Engineering notes and product updates from the team building Bolna's voice AI infrastructure.",
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
  openGraph: {
    title: "Voice AI Engineering & Product Updates — Bolna Blog",
    description:
      "Engineering notes and product updates from the team building Bolna's voice AI infrastructure.",
    url: SITE_URL,
    siteName: "Bolna Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice AI Engineering & Product Updates — Bolna Blog",
    description:
      "Engineering notes and product updates from the team building Bolna's voice AI infrastructure.",
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
