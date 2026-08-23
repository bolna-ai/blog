import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// bolna.ai/blog works by rewriting (not redirecting) into this app's own
// Vercel deployment, so the raw deployment URL is always reachable directly
// too — and search engines can index it as duplicate content if it's left
// open. A proxied request always carries the original host in
// x-forwarded-host (confirmed empirically: bolnablog.vercel.app -> "www.
// bolna.ai", a direct hit -> "bolnablog.vercel.app" itself); anything else
// (the bare deployment domain, preview URLs, itself) gets sent to the
// canonical URL instead of served.
export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost?.endsWith("bolna.ai")) {
    return NextResponse.next();
  }

  const incoming = new URL(request.url);
  if (incoming.hostname === "localhost" || incoming.hostname === "127.0.0.1") {
    return NextResponse.next();
  }

  const target = new URL(incoming.pathname + incoming.search, "https://www.bolna.ai");
  return NextResponse.redirect(target, 308);
}
