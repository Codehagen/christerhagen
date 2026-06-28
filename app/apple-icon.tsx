import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// The CH monogram, matching favicon.svg (ink square, paper serif "CH").
export default function AppleIcon() {
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
          fontWeight: 500,
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "-2px",
        }}
      >
        CH
      </div>
    ),
    { ...size }
  )
}
