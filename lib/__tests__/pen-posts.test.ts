import { describe, expect, it } from "vitest"

import { POST_PEN, WRITING_PEN, cut } from "@/lib/pen/posts"
import { postOrder, posts } from "@/lib/posts"

const LANGS = ["en", "no"] as const

describe("the pen's notes on the writing", () => {
  for (const lang of LANGS) {
    for (const slug of postOrder) {
      const pen = POST_PEN[lang][slug]
      const body = posts[lang][slug].body

      it(`${lang}/${slug}: every phrase is cut from its paragraph`, () => {
        expect(() => cut(body[pen.ring.p], pen.ring.phrase)).not.toThrow()
        expect(() => cut(body[pen.hl.p], pen.hl.phrase)).not.toThrow()
      })

      it(`${lang}/${slug}: one mark per paragraph, one section per paragraph`, () => {
        const ps = [pen.bracket.p, pen.ring.p, pen.hl.p].sort()
        expect(ps).toEqual([0, 1, 2])
        expect(pen.sections).toHaveLength(body.length)
        expect(new Set(pen.sections.map((s) => s.id)).size).toBe(3)
      })

      it(`${lang}/${slug}: notes are lowercase, without em dashes`, () => {
        const notes = [pen.bracket.note, pen.ring.note, pen.hl.note, pen.next]
        for (const n of notes) {
          expect(n).toBe(n.toLowerCase())
          expect(n).not.toMatch(/—/)
        }
      })
    }

    it(`${lang}: the index note is lowercase, without em dashes`, () => {
      const n = WRITING_PEN[lang].note
      expect(n).toBe(n.toLowerCase())
      expect(n).not.toMatch(/—/)
    })
  }
})
