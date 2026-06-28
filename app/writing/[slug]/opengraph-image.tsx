import { ImageResponse } from "next/og"

import { posts, postOrder, isPostSlug } from "@/lib/posts"

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
  const title = isPostSlug(slug) ? posts.en[slug].title : "Writing"
  const date = isPostSlug(slug) ? posts.en[slug].date : ""

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
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "64px",
              height: "8px",
              backgroundColor: "#b4471f",
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
            Writing{date ? ` · ${date}` : ""}
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
    { ...size }
  )
}
