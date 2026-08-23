import { NextResponse, type NextRequest } from "next/server"

/**
 * Markdown content negotiation (acceptmarkdown.com).
 *
 * Two ways in, one implementation behind them:
 *   - `Accept: text/markdown` on a normal URL   → the markdown twin
 *   - an explicit `.md` suffix (/about.md)      → the markdown twin
 *
 * Everything else passes through as HTML, but with `Accept` added to `Vary` so
 * a CDN never serves one representation to a client that asked for the other.
 */

/**
 * Deliberately strict: only an explicit `text/markdown` entry counts. Browsers
 * send `text/html,...,*​/*` and must keep getting HTML, so a wildcard match here
 * would break the site for every human visitor.
 */
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false
  return accept
    .split(",")
    .some((part) => part.trim().toLowerCase().startsWith("text/markdown"))
}

/** True for /images/x.jpg, /llms.txt, /sitemap.xml — anything but a page. */
function isFileRequest(pathname: string): boolean {
  const last = pathname.slice(pathname.lastIndexOf("/") + 1)
  return last.includes(".")
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.endsWith(".md")) {
    // "/about.md" -> "/about", and "/index.md" / "/no/index.md" -> the home
    // page of that locale (a root URL has no bare name to hang ".md" on).
    let base = pathname.slice(0, -".md".length)
    if (base.endsWith("/index")) base = base.slice(0, -"index".length)
    if (base.length > 1 && base.endsWith("/")) base = base.slice(0, -1)
    return NextResponse.rewrite(new URL("/md" + (base || "/"), request.url))
  }

  if (!isFileRequest(pathname) && prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.rewrite(new URL("/md" + pathname, request.url))
  }

  // HTML passes through untouched. `Vary: Accept` is declared on the markdown
  // responses themselves (see app/md/[[...path]]/route.ts) — Next owns the Vary
  // header on App Router page responses and overwrites anything set here or in
  // next.config headers(), verified against `next start`.
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|md/).*)"],
}
