import { ImageResponse } from "next/og"

import { newsreaderFonts, OG_FONT_FAMILY } from "@/lib/og-fonts"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// The CH monogram, matching favicon.svg (ink square, paper serif "CH").
export default async function AppleIcon() {
  const fonts = await newsreaderFonts()
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#26231C",
          color: "#F5F2EA",
          fontSize: 92,
          fontWeight: 600,
          fontFamily: OG_FONT_FAMILY,
          letterSpacing: "-2px",
        }}
      >
        CH
      </div>
    ),
    { ...size, fonts }
  )
}
