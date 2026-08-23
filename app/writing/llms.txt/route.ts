import { sectionLlmsTxt } from "@/lib/markdown"

export const dynamic = "force-static"

export function GET() {
  return new Response(sectionLlmsTxt("writing"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  })
}
