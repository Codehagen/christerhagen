import { ImageResponse } from "next/og"

import { posts, postOrder, isPostSlug } from "@/lib/posts"
import { newsreaderFonts, OG_FONT_FAMILY } from "@/lib/og-fonts"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Christer Hagen"

export function generateStaticParams() {
  return postOrder.map((slug) => ({ slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const title = isPostSlug(slug) ? posts.no[slug].title : "Tekster"
  const date = isPostSlug(slug) ? posts.no[slug].date : ""
  const fonts = await newsreaderFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F5F2EA",
          color: "#26231C",
          padding: "100px",
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "64px",
              height: "8px",
              backgroundColor: "#a04e28",
              marginBottom: "48px",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8a8472",
              marginBottom: "28px",
            }}
          >
            Tekster{date ? ` · ${date}` : ""}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "32px",
            color: "#5a564c",
          }}
        >
          Christer Hagen
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
