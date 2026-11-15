import { ImageResponse } from "next/og"

import { OG_PEN_COLOR } from "@/lib/og-card"
import { OG_SANS, OG_STRONG, ogFonts } from "@/lib/og-fonts"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** The pen loop (components/site/pen.tsx LOOP_D), redrawn for a square. */
const RING =
  "M 98 37 C 138 34, 160 58, 158 92 C 156 128, 128 148, 88 147 C 50 146, 22 124, 23 89 C 24 56, 50 33, 92 34 C 108 34.5, 120 38, 127 44"

// The favicon's mark (app/icon.svg: CH in Inter 560, ink) on the ground,
// since iOS fills a transparent icon with black. Here there is room for the
// pen: one blue loop round the letters, too fine to survive at 16px.
export default async function AppleIcon() {
  const fonts = await ogFonts()
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#FDFDFC",
          color: "#111111",
          fontFamily: OG_SANS,
          fontWeight: OG_STRONG,
          fontSize: 68,
          letterSpacing: "-0.025em",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <path
            d={RING}
            fill="none"
            stroke={OG_PEN_COLOR.blue}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ display: "flex", marginTop: -4 }}>CH</div>
      </div>
    ),
    { ...size, fonts }
  )
}
