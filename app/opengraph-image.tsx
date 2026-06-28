import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Christer Hagen"

export default async function OpengraphImage() {
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
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
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
            fontSize: "120px",
            fontWeight: 700,
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
          Serial entrepreneur &amp; angel investor · Bodø, Norway
        </div>
      </div>
    ),
    { ...size }
  )
}
