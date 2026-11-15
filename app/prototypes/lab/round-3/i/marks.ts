import type { Lang } from "@/lib/companies"
import type { PostSlug } from "@/lib/posts"

/**
 * The pen's pass over each post, in both languages. One of each kept mark per
 * post, each on its own paragraph: a ring on one fact (03/21), a highlighter
 * on the sentence that carries the post (05), a bracket down a paragraph
 * (01). Every phrase is cut from the post's own copy in lib/posts; every note
 * is a dry paraphrase of something the site already says.
 */

export type Marks = {
  /** The rail's names for the three paragraphs. */
  rail: [string, string, string]
  ring: { p: number; phrase: string; note: string }
  hl: { p: number; phrase: string; note: string }
  bracket: { p: number; note: string }
  /** What the pen says beside read next, about the post it points to. */
  next: string
}

export const MARKS: Record<Lang, Record<PostSlug, Marks>> = {
  en: {
    "docdir-visma": {
      rail: ["The tool", "The sale", "The lesson"],
      bracket: { p: 0, note: "the prospectus, the worst part of a deal" },
      ring: { p: 1, phrase: "PowerOffice", note: "the first one. docdir, the second" },
      hl: {
        p: 2,
        phrase: "solve a boring, expensive problem for a specific group of people, in their own language,",
        note: "boring, expensive, and in norwegian",
      },
      next: "why it was built up north",
    },
    "building-in-bodo": {
      rail: ["Oslo", "Bodø", "Anywhere"],
      ring: { p: 0, phrase: "1,200 kilometres", note: "that far north of oslo" },
      hl: { p: 1, phrase: "Talent is loyal, rent is cheap, focus is easy.", note: "the case, in one line" },
      bracket: { p: 2, note: "the problem counts, the place doesn’t" },
      next: "back to the first one, refenze",
    },
    "apparel-to-software": {
      rail: ["Refenze", "Physical", "Software"],
      ring: { p: 0, phrase: "25% a month", note: "at its peak, not every month" },
      hl: {
        p: 1,
        phrase: "cash is real, inventory is a bet, and a refund is a conversation rather than a button.",
        note: "three things software skips",
      },
      bracket: { p: 2, note: "as if you still mailed the box" },
      next: "the one that sold, to visma",
    },
  },
  no: {
    "docdir-visma": {
      rail: ["Verktøyet", "Salget", "Lærdommen"],
      bracket: { p: 0, note: "salgsoppgaven, den verste delen av en handel" },
      ring: { p: 1, phrase: "PowerOffice", note: "det første. docdir, det andre" },
      hl: {
        p: 2,
        phrase: "løs et kjedelig, dyrt problem for en bestemt gruppe mennesker, på deres eget språk,",
        note: "kjedelig, dyrt, og på norsk",
      },
      next: "hvorfor det ble bygget i nord",
    },
    "building-in-bodo": {
      rail: ["Oslo", "Bodø", "Hvor som helst"],
      ring: { p: 0, phrase: "1 200 kilometer", note: "så langt nord for oslo" },
      hl: {
        p: 1,
        phrase: "Folk er lojale, husleia er billig, det er lett å fokusere.",
        note: "hele argumentet, på én linje",
      },
      bracket: { p: 2, note: "problemet teller, ikke stedet" },
      next: "tilbake til det første, refenze",
    },
    "apparel-to-software": {
      rail: ["Refenze", "Fysisk", "Programvare"],
      ring: { p: 0, phrase: "25 % vekst i måneden", note: "på det meste, ikke hver måned" },
      hl: {
        p: 1,
        phrase: "penger er ekte, lager er et veddemål, og en refusjon er en samtale og ikke en knapp.",
        note: "tre ting programvare hopper over",
      },
      bracket: { p: 2, note: "som om du fortsatt sendte esken" },
      next: "det som ble solgt, til visma",
    },
  },
}

/** Pen toggle and read-next copy the site does not have yet. */
export const UI: Record<Lang, { hide: string; show: string; notes: string }> = {
  en: { hide: "Hide the pen", show: "Show the pen", notes: "3 notes" },
  no: { hide: "Skjul pennen", show: "Vis pennen", notes: "3 notater" },
}
