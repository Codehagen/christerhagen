import type { Lang } from "@/lib/companies"
import type { PostSlug } from "@/lib/posts"

/**
 * The pen's pass over the writing (DESIGN.md §3), in both languages, from the
 * lab's round-3/i/marks.ts (posts) and round-3/j/49-writing.tsx (the index).
 *
 * A post gets one of each kept mark, each on its own paragraph: a bracket
 * down one paragraph (01), a ring with an arrow on one fact (03), the
 * highlighter on the sentence that carries the post (05). `next` is 45's last
 * mark, the pen's line beside read next about the post it points to.
 *
 * Every `phrase` is cut verbatim from the post's body in lib/posts.ts (a test
 * holds them to it); every note is a lowercase, dry paraphrase of something
 * the site already says. No em dashes.
 */

export type PostSection = { id: string; label: string }

export type PostPen = {
  /** The rail's names for the three paragraphs, and their anchors. */
  sections: [PostSection, PostSection, PostSection]
  bracket: { p: number; note: string }
  ring: { p: number; phrase: string; note: string }
  hl: { p: number; phrase: string; note: string }
  next: string
}

export const POST_PEN: Record<Lang, Record<PostSlug, PostPen>> = {
  en: {
    "docdir-visma": {
      sections: [
        { id: "the-tool", label: "The tool" },
        { id: "the-sale", label: "The sale" },
        { id: "the-lesson", label: "The lesson" },
      ],
      bracket: { p: 0, note: "the prospectus, the worst part of a deal" },
      ring: {
        p: 1,
        phrase: "PowerOffice",
        note: "the first one. docdir, the second",
      },
      hl: {
        p: 2,
        phrase:
          "solve a boring, expensive problem for a specific group of people, in their own language,",
        note: "boring, expensive, and in norwegian",
      },
      next: "why it was built up north",
    },
    "building-in-bodo": {
      sections: [
        { id: "oslo", label: "Oslo" },
        { id: "bodo", label: "Bodø" },
        { id: "anywhere", label: "Anywhere" },
      ],
      ring: { p: 0, phrase: "1,200 kilometres", note: "that far north of oslo" },
      hl: {
        p: 1,
        phrase: "Talent is loyal, rent is cheap, focus is easy.",
        note: "the case, in one line",
      },
      bracket: { p: 2, note: "the problem counts, the place doesn’t" },
      next: "back to the first one, refenze",
    },
    "apparel-to-software": {
      sections: [
        { id: "refenze", label: "Refenze" },
        { id: "physical", label: "Physical" },
        { id: "software", label: "Software" },
      ],
      ring: { p: 0, phrase: "25% a month", note: "at its peak, not every month" },
      hl: {
        p: 1,
        phrase:
          "cash is real, inventory is a bet, and a refund is a conversation rather than a button.",
        note: "three things software skips",
      },
      bracket: { p: 2, note: "as if you still mailed the box" },
      next: "the one that sold, to visma",
    },
  },
  no: {
    "docdir-visma": {
      sections: [
        { id: "verktoyet", label: "Verktøyet" },
        { id: "salget", label: "Salget" },
        { id: "laerdommen", label: "Lærdommen" },
      ],
      bracket: { p: 0, note: "salgsoppgaven, den verste delen av en handel" },
      ring: {
        p: 1,
        phrase: "PowerOffice",
        note: "det første. docdir, det andre",
      },
      hl: {
        p: 2,
        phrase:
          "løs et kjedelig, dyrt problem for en bestemt gruppe mennesker, på deres eget språk,",
        note: "kjedelig, dyrt, og på norsk",
      },
      next: "hvorfor det ble bygget i nord",
    },
    "building-in-bodo": {
      sections: [
        { id: "oslo", label: "Oslo" },
        { id: "bodo", label: "Bodø" },
        { id: "hvor-som-helst", label: "Hvor som helst" },
      ],
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
      sections: [
        { id: "refenze", label: "Refenze" },
        { id: "fysisk", label: "Fysisk" },
        { id: "programvare", label: "Programvare" },
      ],
      ring: {
        p: 0,
        phrase: "25 % vekst i måneden",
        note: "på det meste, ikke hver måned",
      },
      hl: {
        p: 1,
        // lib/posts.ts was copy-edited: "en samtale og ikke en knapp" (no dash).
        phrase:
          "penger er ekte, lager er et veddemål, og en refusjon er en samtale og ikke en knapp.",
        note: "tre ting programvare hopper over",
      },
      bracket: { p: 2, note: "som om du fortsatt sendte esken" },
      next: "det som ble solgt, til visma",
    },
  },
}

/** 49: the one line beside the newest title on the writing index. */
export const WRITING_PEN: Record<Lang, { note: string }> = {
  en: { note: "the one about the sale" },
  no: { note: "den om salget" },
}

/**
 * Which of a post's notes its Open Graph card carries in the margin: the one
 * that still reads beside the title alone, without the paragraph it marks.
 */
export const POST_OG_NOTE: Record<PostSlug, "bracket" | "ring" | "hl"> = {
  "docdir-visma": "hl",
  "building-in-bodo": "ring",
  "apparel-to-software": "hl",
}

/** The margin note on a post's Open Graph card (see POST_OG_NOTE). */
export function postOgNote(lang: Lang, slug: PostSlug): string {
  return POST_PEN[lang][slug][POST_OG_NOTE[slug]].note
}

/**
 * Splits `text` around the first `phrase`: [before, phrase, after]. Throws
 * when the phrase is missing, so a copy edit that breaks a mark fails loudly
 * (in the test, and at build) instead of silently dropping it.
 */
export function cut(text: string, phrase: string): [string, string, string] {
  const i = text.indexOf(phrase)
  if (i < 0) throw new Error(`pen: "${phrase}" is not in "${text}"`)
  return [text.slice(0, i), phrase, text.slice(i + phrase.length)]
}
