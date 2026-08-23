import { NextResponse, type NextRequest } from "next/server"

/**
 * Markdown content negotiation (acceptmarkdown.com) and the agent entry points.
 *
 * Four ways in, one implementation behind them:
 *   - `Accept: text/markdown` on a normal URL   → the markdown twin
 *   - an explicit `.md` suffix (/about.md)      → the markdown twin
 *   - `?mode=agent`                             → the markdown twin
 *   - a known AI-agent User-Agent               → the markdown twin
 *
 * Everything else — every browser, and every search crawler — passes through
 * as HTML, untouched.
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

/**
 * Answer-engine and AI crawlers: they read a page to answer a question, not to
 * render it, so markdown serves them better than a styled document. Googlebot
 * and Bingbot are deliberately absent — they index for search, and search
 * results should keep pointing at the real pages.
 */
const AGENT_UA =
  /(GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|DeepSeekBot|ora-agent)/i

/** True for /images/x.jpg, /llms.txt, /sitemap.xml — anything but a page. */
function isFileRequest(pathname: string): boolean {
  const last = pathname.slice(pathname.lastIndexOf("/") + 1)
  return last.includes(".")
}

function toMarkdown(request: NextRequest, path: string) {
  return NextResponse.rewrite(new URL("/md" + (path || "/"), request.url))
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.endsWith(".md")) {
    // "/about.md" -> "/about", and "/index.md" / "/no/index.md" -> the home
    // page of that locale (a root URL has no bare name to hang ".md" on).
    let base = pathname.slice(0, -".md".length)
    if (base.endsWith("/index")) base = base.slice(0, -"index".length)
    if (base.length > 1 && base.endsWith("/")) base = base.slice(0, -1)
    return toMarkdown(request, base || "/")
  }

  if (isFileRequest(pathname)) return NextResponse.next()

  if (
    prefersMarkdown(request.headers.get("accept")) ||
    searchParams.get("mode") === "agent" ||
    AGENT_UA.test(request.headers.get("user-agent") ?? "")
  ) {
    return toMarkdown(request, pathname)
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
