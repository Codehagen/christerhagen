import { llmsFullText } from "@/lib/markdown"

export const dynamic = "force-static"

export function GET() {
  return new Response(llmsFullText(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  })
}
