import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** The favicon's pen loop (app/icon.svg), in its 64-unit box. */
const LOOP =
  "M 18 18 C 26 9.5, 44 8.5, 53 17 C 61.5 25, 59.5 41, 49 48.5 C 38.5 56, 20 55, 11.5 45.5 C 4 37, 6 22.5, 17.5 14.5 C 22 11.5, 27 10, 31 9.5"

// The same mark as the favicon: the tilted pen loop in near-white on ink.
// Full-bleed ink, since iOS rounds the corners itself.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#111111",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 64 64">
          <g transform="translate(32 32) scale(.78) rotate(-12) translate(-32 -32)">
          <path
            d={LOOP}
            fill="none"
            stroke="#FDFDFC"
            strokeWidth="5.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  )
}
