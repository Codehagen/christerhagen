import type { Lang } from "@/lib/companies"

export interface BrandColour {
  name: string
  hex: string
  css: string
  use: string
}

export interface BrandContent {
  kicker: string
  head: string
  intro: string
  lblLogo: string
  lblColour: string
  lblType: string
  lblVoice: string
  lblElements: string
  logoNote: string
  colours: BrandColour[]
  typeSerifUse: string
  typeMonoUse: string
  voice: string[]
}

const palette: { name: string; hex: string; css: string }[] = [
  { name: "Paper", hex: "#F5F2EA", css: "#F5F2EA" },
  { name: "Ink", hex: "#211E18", css: "#211E18" },
  { name: "Stone", hex: "#56514A", css: "#56514A" },
  { name: "Sand", hex: "#A79F8C", css: "#A79F8C" },
  { name: "Line", hex: "#E6E0D3", css: "#E6E0D3" },
  { name: "Rust", hex: "oklch(.52 .12 44)", css: "oklch(0.52 0.12 44)" },
]

function colours(use: string[]): BrandColour[] {
  return palette.map((c, i) => ({ ...c, use: use[i] }))
}

export const brandContent: Record<Lang, BrandContent> = {
  en: {
    kicker: "Brand kit",
    head: "The system behind this site.",
    intro:
      "A small, deliberate set of type, colour and voice. Editorial, restrained, the same in English and Norwegian.",
    lblLogo: "Logo",
    lblColour: "Colour",
    lblType: "Type",
    lblVoice: "Voice",
    lblElements: "Elements",
    logoNote:
      "The wordmark is set in Newsreader. The CH monogram works on ink or paper, and is the favicon. Give it room to breathe.",
    colours: colours([
      "Background",
      "Primary text",
      "Secondary text",
      "Labels and meta",
      "Borders and dividers",
      "Accent, used sparingly",
    ]),
    typeSerifUse: "Display & body",
    typeMonoUse: "Labels & meta",
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
      "Et lite, bevisst sett av typografi, farge og stemme. Redaksjonelt, nedtonet, likt på engelsk og norsk.",
    lblLogo: "Logo",
    lblColour: "Farge",
    lblType: "Type",
    lblVoice: "Stemme",
    lblElements: "Elementer",
    logoNote:
      "Ordmerket er satt i Newsreader. CH-monogrammet fungerer på blekk eller papir, og er favikonet. Gi det plass til å puste.",
    colours: colours([
      "Bakgrunn",
      "Primærtekst",
      "Sekundærtekst",
      "Etiketter og meta",
      "Kanter og skiller",
      "Aksent, brukt sparsomt",
    ]),
    typeSerifUse: "Display & brødtekst",
    typeMonoUse: "Etiketter & meta",
    voice: [
      "Første person. Jeg, ikke vi.",
      "Likefrem. Ingen hype, ingen fyllord.",
      "Tospråklig. Hver side fungerer på engelsk og norsk.",
      "Tilbakeholdenhet. Luft framfor dekorasjon.",
    ],
  },
}
