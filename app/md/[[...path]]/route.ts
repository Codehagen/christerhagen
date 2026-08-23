import {
  markdownFor,
  markdownPaths,
  markdownDocument,
  notFoundMd,
  langForPath,
} from "@/lib/markdown"
import { SITE_URL } from "@/lib/seo"

// Prerendered alongside the HTML pages: the markdown twins are as static as the
// pages they mirror. Unknown paths still fall through to a rendered 404.
export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return markdownPaths().map((p) => ({
    path: p === "/" ? [] : p.slice(1).split("/"),
  }))
}

function markdownResponse(body: string, pathname: string, status: number) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      // The whole point of the negotiation: without Accept in Vary a CDN can
      // hand this markdown to a browser that asked for HTML, or vice versa.
      vary: "Accept, Accept-Encoding",
      link: `<${SITE_URL}${pathname}>; rel="canonical"`,
      "x-robots-tag": "noindex",
    },
  })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params
  const pathname = "/" + (path ?? []).join("/")

  const body = markdownFor(pathname)
  if (body === null) {
    return markdownResponse(
      markdownDocument(pathname, notFoundMd(langForPath(pathname))),
      pathname,
      404
    )
  }
  return markdownResponse(markdownDocument(pathname, body), pathname, 200)
}
