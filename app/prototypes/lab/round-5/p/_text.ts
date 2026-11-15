import { companies, type Lang } from "@/lib/companies"
import { aboutContent, homeContent } from "@/lib/content"
import { posts } from "@/lib/posts"

/**
 * The long posts for group p, assembled only from sentences the site already
 * has: the posts (lib/posts), the about bio and timeline (lib/content) and
 * the company stories (lib/companies). Nothing here is new prose. The only
 * words written for the lab are the titles and section names marked MINE,
 * and the pen's notes, which paraphrase what the assembled text says.
 */

/** The n-th sentence of a paragraph (or from n to the end with `rest`). */
export function sent(text: string, n: number, rest = false) {
  const all = text.split(/(?<=[.!?])\s+/)
  return rest ? all.slice(n).join(" ") : all[n] ?? ""
}

export function words(texts: string[]) {
  return texts.join(" ").split(/\s+/).filter(Boolean).length
}

/** benji's own rate is not stated; 200 words a minute is the usual one. */
export const WPM = 200

const P = (l: Lang) => posts[l]
const A = (l: Lang) => aboutContent[l]
const Co = (l: Lang) => companies[l]

/* ───────────── 74: ten years, told in years ───────────── */

export type YearSection = { year: string; event: string; paras: string[] }

export function tenYears(l: Lang): { title: string; span: string; sections: YearSection[] } {
  const a = A(l)
  const c = Co(l)
  const p = P(l)
  const ev = (y: string) => a.timeline.find((t) => t.year === y)?.event ?? ""
  return {
    // MINE: the title. 2016 to 2026 is the timeline's own first and last year.
    title: l === "en" ? "Ten years of building in the north" : "Ti år med å bygge i nord",
    span: "2016–2026",
    sections: [
      { year: "2016", event: ev("2016"), paras: [a.bio[0], a.bio[1], p["apparel-to-software"].body[1], c.refenze.body[1]] },
      { year: "2017", event: ev("2017"), paras: [c.codebase.body[0], c.codebase.body[1]] },
      { year: "2021", event: ev("2021"), paras: [c.sailsdock.body[0], c.sailsdock.body[1]] },
      { year: "2024", event: ev("2024"), paras: [c["advanti-estate"].body[0], c["advanti-estate"].body[1], p["docdir-visma"].body[0]] },
      {
        year: "2026",
        event: ev("2026"),
        paras: [p["docdir-visma"].body[1], `${sent(a.bio[2], 2)} ${c.bedrifty.body[1]}`, `${p["docdir-visma"].body[2]} ${sent(a.bio[3], 1)}`],
      },
    ],
  }
}

/* ───────────── 75: claims and their sources ───────────── */

/** A run of text, or a source tag pointing at a press item by its index in aboutContent.press. */
export type Seg = string | { src: number }

export type SourcedSection = { name: string; paras: Seg[][] }

/**
 * Only claims a headline plainly reports carry a tag: the AI sale (Bodø Nu),
 * the AI championship (Bodø Nu) and the apparel brand at 25 (Avisa Nordland).
 */
export function sourced(l: Lang): { title: string; date: string; dateISO: string; sections: SourcedSection[] } {
  const a = A(l)
  const c = Co(l)
  const p = P(l)
  const d = p["docdir-visma"]
  const ap = p["apparel-to-software"]
  // MINE (from round-3/i/marks.ts, the kept post's rail): the three section names.
  const names = l === "en" ? ["The tool", "The sale", "The lesson"] : ["Verktøyet", "Salget", "Lærdommen"]
  return {
    title: d.title,
    date: d.date,
    dateISO: d.dateISO,
    sections: [
      { name: names[0], paras: [[d.body[0]], [sent(c.docdir.body[0], 0)]] },
      {
        name: names[1],
        paras: [
          [sent(d.body[1], 0), { src: 1 }, " ", sent(d.body[1], 1, true)],
          [sent(a.bio[3], 0), { src: 2 }],
        ],
      },
      {
        name: names[2],
        paras: [[sent(ap.body[0], 0), { src: 8 }, " ", sent(ap.body[0], 1, true)], [ap.body[1]], [`${d.body[2]} ${sent(a.bio[3], 1)}`]],
      },
    ],
  }
}

/* ───────────── 76: the Bodø post, long ───────────── */

export function bodo(l: Lang) {
  const a = A(l)
  const c = Co(l)
  const p = P(l)
  const b = p["building-in-bodo"]
  const d = p["docdir-visma"]
  return {
    title: b.title,
    date: b.date,
    dateISO: b.dateISO,
    paras: [b.body[0], a.bio[0], b.body[1], c["advanti-estate"].body[0], d.body[0], d.body[1], d.body[2], b.body[2], sent(a.bio[3], 1)],
    /** The pen's summary: three lines, each a paraphrase of a sentence above. */
    summary:
      l === "en"
        ? ["you don’t have to move to oslo", "loyal people, cheap rent, easy focus", "solve the problem. the place stops mattering"]
        : ["du trenger ikke flytte til oslo", "lojale folk, billig husleie, lett å fokusere", "løs problemet. stedet slutter å bety noe"],
  }
}

/* ───────────── 77: the companies, with their facts ───────────── */

export type Fact = { name: string; year: string; outcome: string; key: string }
export type FactSection = { name: string; paras: string[]; facts: Fact[] }

export function companiesPost(l: Lang): { title: string; span: string; sections: FactSection[] } {
  const a = A(l)
  const c = Co(l)
  const p = P(l)
  const f = (k: keyof typeof c): Fact => ({ name: c[k].name, year: c[k].year, outcome: c[k].stage, key: k })
  const nav = homeContent[l].work.find((w) => w.name === "Not Another VC")
  const navFact: Fact = { name: "Not Another VC", year: nav ? nav.period.replace(/\D+/g, "") : "2023", outcome: nav?.role.split("·")[1]?.trim().split(" ")[0] ?? "", key: "nav" }
  return {
    // MINE: the title.
    title: l === "en" ? "From Refenze to Bedrifty" : "Fra Refenze til Bedrifty",
    span: "2016–2026",
    sections: [
      { name: "Refenze", paras: [a.bio[0], a.bio[1], c.refenze.body[1]], facts: [f("refenze")] },
      { name: "Codebase", paras: [c.codebase.body[0], c.codebase.body[1]], facts: [f("codebase")] },
      { name: "Sailsdock", paras: [c.sailsdock.body[0], c.sailsdock.body[1]], facts: [f("sailsdock")] },
      { name: "Docdir", paras: [p["docdir-visma"].body[0], c.docdir.body[1]], facts: [f("docdir")] },
      {
        name: "Advanti Estate",
        paras: [c["advanti-estate"].body[0], c["advanti-estate"].body[1], `${c.propdock.body[0]} ${c.propdock.body[1]}`],
        facts: [f("advanti-estate"), f("propdock")],
      },
      {
        name: "Bedrifty",
        paras: [c.bedrifty.body[0], c.bedrifty.body[1], `${sent(a.bio[2], 3)} ${sent(a.bio[3], 1)}`],
        facts: [f("bedrifty"), navFact],
      },
    ],
  }
}

/* ───────────── 78: the property post, with the words it borrows ───────────── */

export type Term = { phrase: string; pen: string }
export type TermPara = { text: string; terms: Term[] }
export type TermSection = { name: string; paras: TermPara[] }

/**
 * Each term is a word the site's Norwegian copy uses for the English one in
 * the same sentence (lib/posts, lib/companies). In English the pen writes the
 * Norwegian; in Norwegian it writes the English back.
 */
const GLOSS: { en: string; no: string }[] = [
  { en: "real-estate transaction", no: "eiendomshandel" },
  { en: "sales prospectus", no: "salgsoppgave" },
  { en: "agents", no: "meglere" },
  { en: "the Visma group", no: "Visma-konsernet" },
  { en: "commercial property", no: "næringseiendom" },
  { en: "company data", no: "bedriftsdata" },
]

/** Where each term sits in the Norwegian copy (inflected as the copy has it). */
const NO_PHRASE = ["eiendomshandel", "salgsoppgaven", "meglere", "Visma-konsernet", "næringseiendom", "bedriftsdata"]

function term(l: Lang, i: number): Term {
  const g = GLOSS[i]
  return l === "en" ? { phrase: g.en, pen: `${g.no} = ${g.en.replace(/^the /, "")}` } : { phrase: NO_PHRASE[i], pen: `${g.en.replace(/^the /, "")} = ${g.no}` }
}

export function property(l: Lang): { title: string; span: string; sections: TermSection[] } {
  const c = Co(l)
  const d = P(l)["docdir-visma"]
  // MINE: the title (from Advanti's "a traditionally analogue industry") and the three section names.
  const names = l === "en" ? ["Documents", "Brokerage", "Data"] : ["Dokumenter", "Megling", "Data"]
  return {
    title: l === "en" ? "Software for an analogue industry" : "Programvare for en analog bransje",
    span: "2024–2026",
    sections: [
      {
        name: names[0],
        paras: [
          { text: d.body[0], terms: [term(l, 0), term(l, 1), term(l, 2)] },
          { text: d.body[1], terms: [term(l, 3)] },
        ],
      },
      {
        name: names[1],
        paras: [
          { text: c["advanti-estate"].body[0], terms: [term(l, 4)] },
          { text: c["advanti-estate"].body[1], terms: [] },
          { text: c.vendo.body[0], terms: [] },
          { text: c.fotovibe.body[0], terms: [] },
        ],
      },
      {
        name: names[2],
        paras: [
          { text: c.bedrifty.body[0], terms: [term(l, 5)] },
          { text: c.bedrifty.body[1], terms: [] },
          { text: c.propdock.body[0], terms: [] },
          { text: d.body[2], terms: [] },
        ],
      },
    ],
  }
}
