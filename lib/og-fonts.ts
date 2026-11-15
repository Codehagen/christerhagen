import { readFile } from "node:fs/promises"
import { join } from "node:path"

/*
 * The site's two faces as bundled, subset static instances for next/og
 * ImageResponse (satori reads neither variable fonts nor OpenType feature
 * settings). Built with fonttools from Inter 4 and Caveat:
 *
 * - Inter-400.ttf: wght 400, opsz 24.
 * - Inter-560.ttf: wght 560 (DESIGN.md --weight-strong), opsz 32. satori only
 *   takes weights in hundreds, so it is registered as 600: `fontWeight: 600`
 *   in an image draws the 560 cut.
 * - Caveat-400.ttf: the pen, as on the site.
 *
 * Inter's "cv11" and "ss01" (the site's font-feature-settings) are folded
 * into the cmap, so the images get the same single-storey a and open digits.
 * Subset to Latin-1 plus the punctuation and arrows the site uses.
 *
 * The images are rendered at build or on first request on the server, so
 * reading from the repo via process.cwd() is reliable. Cached per process.
 */
let cache: Awaited<ReturnType<typeof load>> | null = null

async function load() {
  const dir = join(process.cwd(), "app/_fonts")
  const [regular, strong, pen] = await Promise.all([
    readFile(join(dir, "Inter-400.ttf")),
    readFile(join(dir, "Inter-560.ttf")),
    readFile(join(dir, "Caveat-400.ttf")),
  ])
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: strong, weight: 600 as const, style: "normal" as const },
    { name: "Caveat", data: pen, weight: 400 as const, style: "normal" as const },
  ]
}

export async function ogFonts() {
  if (!cache) cache = await load()
  return cache
}

export const OG_SANS = "Inter, ui-sans-serif, system-ui, sans-serif"
export const OG_PEN = "Caveat, cursive"
/** `fontWeight` that draws the bundled 560 cut (see above). */
export const OG_STRONG = 600
