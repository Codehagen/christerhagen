import { Caveat, Inter, JetBrains_Mono, Newsreader } from "next/font/google"

/**
 * Every next/font loader the site uses, called once. Turbopack fails the build
 * when the same Google font is loaded from several modules with different
 * options, so layouts import from here instead of calling a loader themselves.
 */

/** The site's text: benji's register, Inter at 14/20 (DESIGN.md §2). */
export const fontInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

/**
 * The pen: margin notes and "copied" only. A stand-in for a font made from
 * Christer's own handwriting (DESIGN.md §7.1).
 */
export const fontCaveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
})

/*
 * Legacy faces. The Norwegian presentations (app/no/presentasjon, app/no/lab,
 * components/deck-*) and the curation lab (app/prototypes) are set in
 * Newsreader and JetBrains Mono through `font-serif` / `font-mono`. Only
 * those layouts put `deckFonts` on the page (`--font-serif`, `--font-mono`),
 * so the redesigned site never references or fetches them.
 */
export const fontSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  preload: false,
})

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
  preload: false,
})

/** The two legacy faces' CSS variables, for the presentation and lab layouts. */
export const deckFonts = `${fontSerif.variable} ${fontMono.variable}`
