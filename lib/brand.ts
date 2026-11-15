import type { Lang } from "@/lib/companies"

/**
 * The brand page's copy. Every value here is the site's real one, read off
 * DESIGN.md §2–§3 and app/globals.css. Change them there first.
 */

export interface BrandSwatch {
  name: string
  /** The value as written in the tokens. */
  value: string
  /** The CSS colour that paints the swatch. */
  css: string
  use: string
}

export interface BrandFace {
  name: string
  /** Sizes and weights. */
  spec: string
  use: string
  /** A line set in the face. */
  sample: string
}

export interface BrandContent {
  kicker: string
  head: string
  intro: string
  lblLogo: string
  lblColour: string
  lblPen: string
  lblType: string
  lblVoice: string
  logoNote: string
  colours: BrandSwatch[]
  penNote: string
  pens: BrandSwatch[]
  type: BrandFace[]
  voice: string[]
}

const ground = [
  { value: "#FDFDFC", css: "#FDFDFC" },
  { value: "#111111", css: "#111111" },
  { value: "rgb(18 18 18 / 0.5)", css: "rgb(18 18 18 / 0.5)" },
  { value: "rgb(18 18 18 / 0.3)", css: "rgb(18 18 18 / 0.3)" },
  { value: "rgb(18 18 18 / 0.09)", css: "rgb(18 18 18 / 0.09)" },
  { value: "#FFFFFF", css: "#FFFFFF" },
]

const pen = [
  { value: "#BE123C", css: "#BE123C" },
  { value: "#C2410C", css: "#C2410C" },
  { value: "#2B5CD8", css: "#2B5CD8" },
  { value: "oklch(0.56 0.2 27)", css: "oklch(0.56 0.2 27)" },
  { value: "#178A5A", css: "#178A5A" },
]

function swatches(
  values: { value: string; css: string }[],
  words: [string, string][]
): BrandSwatch[] {
  return values.map((v, i) => ({ ...v, name: words[i][0], use: words[i][1] }))
}

export const brandContent: Record<Lang, BrandContent> = {
  en: {
    kicker: "Brand kit",
    head: "The system behind this site.",
    intro:
      "A small, deliberate set of type, colour and voice: one near-white ground, ink type, and one pen per page. The same in English and Norwegian.",
    lblLogo: "Logo",
    lblColour: "Colour",
    lblPen: "The pen",
    lblType: "Type",
    lblVoice: "Voice",
    logoNote:
      "The wordmark is the name in Inter at weight 560, the same size as the text around it. The CH monogram is the favicon.",
    colours: swatches(ground, [
      ["Ground", "The only ground. Every page sits on it."],
      ["Ink", "Text"],
      ["Muted", "Secondary text, section labels and meta"],
      ["Faint", "Dates, counts and the language not chosen"],
      ["Hairline", "Row dividers and the line above the footer"],
      ["Surface", "Preview cards and product shots"],
    ]),
    penNote:
      "One hand marks the page in my own voice: a ring round a fact, a highlighter on one line, a short note in the margin. One colour per page, used for nothing else. Links have no colour.",
    pens: swatches(pen, [
      ["Rose", "Home"],
      ["Rust", "About and writing"],
      ["Blue", "Posts"],
      ["Red", "Portfolio"],
      ["Green", "Company pages"],
    ]),
    type: [
      {
        name: "Inter",
        spec: "14/20 at 460 · titles 20px at 560",
        use: "Everything you read. Hierarchy comes from weight and grey, not size.",
        sample: "Serial entrepreneur and software developer.",
      },
      {
        name: "Caveat",
        spec: "16px beside prose · 21px beside ledgers",
        use: "The pen’s notes, and “copied”. A stand-in until there is a font made from my own handwriting.",
        sample: "the one about the sale",
      },
    ],
    voice: [
      "First person. I, not we.",
      "Plainspoken. No hype, no filler verbs.",
      "Bilingual. Every page works in English and Norwegian.",
      "Restraint. White space over decoration.",
    ],
  },
  no: {
    kicker: "Brand kit",
    head: "Systemet bak dette nettstedet.",
    intro:
      "Et lite, bevisst sett av typografi, farge og stemme: én nesten hvit bakgrunn, svart tekst og én penn per side. Likt på engelsk og norsk.",
    lblLogo: "Logo",
    lblColour: "Farge",
    lblPen: "Pennen",
    lblType: "Type",
    lblVoice: "Stemme",
    logoNote:
      "Ordmerket er navnet i Inter med vekt 560, i samme størrelse som teksten rundt. CH-monogrammet er favikonet.",
    colours: swatches(ground, [
      ["Bakgrunn", "Den eneste bakgrunnen. Alle sider ligger på den."],
      ["Blekk", "Tekst"],
      ["Dempet", "Sekundærtekst, seksjonsetiketter og meta"],
      ["Svak", "Datoer, antall og språket som ikke er valgt"],
      ["Hårstrek", "Skillelinjer mellom rader og streken over bunnteksten"],
      ["Flate", "Forhåndsvisningskort og produktbilder"],
    ]),
    penNote:
      "Én hånd merker siden med min egen stemme: en ring rundt et faktum, en overstreker på én linje, en kort lapp i margen. Én farge per side, og den brukes ikke til noe annet. Lenker har ingen farge.",
    pens: swatches(pen, [
      ["Rosa", "Forsiden"],
      ["Rust", "Om og tekster"],
      ["Blå", "Innlegg"],
      ["Rød", "Portefølje"],
      ["Grønn", "Selskapssider"],
    ]),
    type: [
      {
        name: "Inter",
        spec: "14/20 i 460 · titler 20 px i 560",
        use: "Alt du leser. Hierarkiet kommer fra vekt og grått, ikke størrelse.",
        sample: "Seriegründer og utvikler.",
      },
      {
        name: "Caveat",
        spec: "16 px ved brødtekst · 21 px ved lister",
        use: "Pennens notater, og «kopiert». En stedfortreder til det finnes en skrift laget av min egen håndskrift.",
        sample: "den om salget",
      },
    ],
    voice: [
      "Første person. Jeg, ikke vi.",
      "Likefrem. Ingen hype, ingen fyllord.",
      "Tospråklig. Hver side fungerer på engelsk og norsk.",
      "Tilbakeholdenhet. Luft framfor dekorasjon.",
    ],
  },
}
