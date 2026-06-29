import { ImageResponse } from "next/og"

import { newsreaderFonts, OG_FONT_FAMILY } from "@/lib/og-fonts"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Christer Hagen"

export default async function OpengraphImage() {
  const fonts = await newsreaderFonts()
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#F5F2EA",
          color: "#26231C",
          padding: "100px",
          fontFamily: OG_FONT_FAMILY,
        }}
      >
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
            fontSize: "120px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Christer Hagen
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "38px",
            color: "#5a564c",
            marginTop: "36px",
          }}
        >
          Serial entrepreneur &amp; software developer · Bodø, Norway
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
