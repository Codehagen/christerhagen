import { ImageResponse } from "next/og"

import { OG_PEN, OG_SANS, OG_STRONG, ogFonts } from "@/lib/og-fonts"

/*
 * The Open Graph template (1200×630) in the site's register (DESIGN.md §1–3):
 * the near-white ground, ink type, hierarchy by weight and grey, and one pen
 * mark in the page's own colour. Nothing else.
 */

export const OG_SIZE = { width: 1200, height: 630 }

/** DESIGN.md §2 tokens, as satori needs them (no CSS variables, no oklch). */
const GROUND = "#FDFDFC"
const INK = "#111111"
const INK_MUTED = "rgba(18, 18, 18, 0.5)"
export const OG_PEN_COLOR = {
  blue: "#2B5CD8",
  rust: "#C2410C",
  red: "#D02C2A", // oklch(0.56 0.2 27)
  green: "#178A5A",
  rose: "#BE123C",
} as const
export type OgPen = keyof typeof OG_PEN_COLOR

/** The pen loop (components/site/pen.tsx LOOP_D) in its 100×40 box. */
const LOOP_D =
  "M 54 4.5 C 80 3.5, 98 9, 97.5 20 C 97 32, 74 37.5, 48 37 C 22 36.5, 2.5 31, 3 19.5 C 3.5 8.5, 24 3, 50 4 C 62 4.4, 70 6, 73 8.5"

function loopBackground(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="${LOOP_D}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`
  return `url("data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}")`
}

export type OgCardProps = {
  /** Small, top left: the name, as in the site header. */
  eyebrow: string
  title: string
  /** Large titles (a name) can go bigger than a post title. */
  titleSize?: number
  /**
   * The grey line under the title. `ringed` follows `text` after a space and
   * is drawn inside the pen loop (flex trims trailing spaces, so `text` ends
   * at its last glyph).
   */
  meta: { text: string; ringed?: string }
  pen: OgPen
  /** A margin note in the pen's hand, with an arrow back to the title. */
  note?: string
}

export async function ogCard({
  eyebrow,
  title,
  titleSize = 68,
  meta,
  pen,
  note,
}: OgCardProps) {
  const color = OG_PEN_COLOR[pen]
  const fonts = await ogFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: GROUND,
          color: INK,
          padding: "64px 80px 76px",
          fontFamily: OG_SANS,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: OG_STRONG,
            letterSpacing: "-0.01em",
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", position: "relative" }}
        >
          <div
            style={{
              display: "flex",
              maxWidth: 720,
              fontSize: titleSize,
              fontWeight: OG_STRONG,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 30,
              fontSize: 28,
              color: INK_MUTED,
              letterSpacing: "-0.006em",
            }}
          >
            {meta.text}
            {meta.ringed ? (
              <div
                style={{ display: "flex", position: "relative", marginLeft: 16 }}
              >
                {meta.ringed}
                <div
                  style={{
                    position: "absolute",
                    left: -12,
                    right: -16,
                    top: -13,
                    bottom: -15,
                    backgroundImage: loopBackground(color),
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            ) : null}
          </div>

          {note ? (
            <div
              style={{
                position: "absolute",
                left: 760,
                top: -96,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 290,
                  textWrap: "balance",
                  fontFamily: OG_PEN,
                  fontSize: 40,
                  lineHeight: 0.98,
                  color,
                  transform: "rotate(-2deg)",
                }}
              >
                {note}
              </div>
              <svg
                width="84"
                height="70"
                viewBox="0 0 84 70"
                style={{ marginTop: 10, marginLeft: -36 }}
              >
                <path
                  d="M 70 4 C 66 30, 46 52, 10 62"
                  fill="none"
                  stroke={color}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path
                  d="M 22 52 L 10 62 L 25 65"
                  fill="none"
                  stroke={color}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
