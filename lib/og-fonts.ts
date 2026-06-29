import { readFile } from "node:fs/promises"
import { join } from "node:path"

// Newsreader (the brand serif) as bundled, subset static instances for next/og
// ImageResponse. satori can't consume Google's variable Newsreader, so we ship
// two static cuts (Regular/SemiBold) generated with fonttools. These OG images
// are pre-rendered at build, so reading from the repo via process.cwd() is
// reliable — no runtime file-tracing concern. Cached across the build.
let cache: Awaited<ReturnType<typeof load>> | null = null

async function load() {
  const dir = join(process.cwd(), "app/_fonts")
  const [regular, semibold] = await Promise.all([
    readFile(join(dir, "Newsreader-400.ttf")),
    readFile(join(dir, "Newsreader-600.ttf")),
  ])
  return [
    { name: "Newsreader", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Newsreader", data: semibold, weight: 600 as const, style: "normal" as const },
  ]
}

export async function newsreaderFonts() {
  if (!cache) cache = await load()
  return cache
}

// Brand serif stack: bundled Newsreader, with serif fallbacks for any glyph
// outside the subset range.
export const OG_FONT_FAMILY = "Newsreader, Georgia, 'Times New Roman', serif"
