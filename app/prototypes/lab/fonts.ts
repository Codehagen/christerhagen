import { Caveat, Inter } from "next/font/google"

/**
 * The lab's extra faces, loaded once. Turbopack fails the build when the same
 * Google font is loaded from several modules with different options, so every
 * piece imports from here instead of calling the loader itself.
 *
 * Newsreader and JetBrains Mono are already on the page from the root layout:
 * use `var(--font-serif)` and `var(--font-mono)` for those.
 */

/** The benji.org register: Inter at 14px, hierarchy by weight and grey. */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--lab-inter",
})

/**
 * Margin notes only. A pen, not a typeface — and a stand-in: the goal is a
 * font made from Christer's own handwriting, the way benji.org uses his.
 */
export const pen = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--lab-pen",
})

export const SERIF = "var(--font-serif), Georgia, serif"
export const MONO = "var(--font-mono), ui-monospace, monospace"
