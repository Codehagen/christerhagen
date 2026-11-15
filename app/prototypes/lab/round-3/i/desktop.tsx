"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import type { PostSlug } from "@/lib/posts"

import { useSeen } from "../../kit"
import { Frame, tagOf } from "../../round-2/h/chrome"
import { MARKS } from "./marks"
import {
  AddressFooter,
  Article,
  type ArticleCtx,
  type MarkKind,
  PenToggle,
  POST_CSS,
  Rail,
  ReadNext,
  SiteHeader,
  usePost,
  useArmed,
  useSpy,
} from "./post"

/** The column: 44cqw from 28cqw, so the margin to its right can hold the pen. */
export const COL = 44

export type PageCtx = {
  slug: PostSlug
  lang: Lang
  /** The page is on screen, settled after its last turn, and the pen is on. */
  live: boolean
  /** The pen is on (whether or not it has drawn yet). */
  pen: boolean
  setPen: (f: (p: boolean) => boolean) => void
  /** Read next has come into view. */
  end: boolean
  seen: boolean
  armed: boolean
}

/**
 * The finished post page at desktop width: header, rail, column, read next,
 * footer. Pieces choose the post, the language, the pen colour, whether the
 * pen starts on, and add the one thing they push.
 */
export function DesktopPost({
  label,
  slug: slug0,
  lang: lang0,
  color,
  wash,
  penDefault = true,
  toggle = true,
  css = "",
  aside,
  afterParagraph,
  pen,
  notes,
  inkedNext,
}: {
  label: string
  slug: PostSlug
  lang: Lang
  color: string
  wash: string
  penDefault?: boolean
  toggle?: boolean
  css?: string
  aside?: (c: PageCtx) => React.ReactNode
  afterParagraph?: (p: number, c: PageCtx) => React.ReactNode
  pen?: (a: ArticleCtx, c: PageCtx) => React.ReactNode
  notes?: (a: ArticleCtx, c: PageCtx) => React.ReactNode
  inkedNext?: (c: PageCtx) => boolean
}) {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { slug, lang, setLang, follow, key } = usePost(slug0, lang0, scrollerRef)
  const armed = useArmed(key)
  const { active, reached, first, end, go } = useSpy(scrollerRef, key)
  const [penOn, setPen] = React.useState(penDefault)
  const m = MARKS[lang][slug]
  const live = seen && armed && penOn
  const ctx: PageCtx = { slug, lang, live, pen: penOn, setPen, end, seen, armed }

  // In reading order: what was on screen at load draws one after another;
  // what scrolling brings in draws as it arrives.
  const pOf = (k: MarkKind) => m[k].p
  const order = (["ring", "hl", "bracket"] as MarkKind[]).sort((a, b) => pOf(a) - pOf(b))
  const on = { ring: false, hl: false, bracket: false } as Record<MarkKind, boolean>
  const delay = { ring: 0, hl: 0, bracket: 0 } as Record<MarkKind, number>
  order.forEach((k, rank) => {
    on[k] = live && reached >= pOf(k)
    delay[k] = pOf(k) <= first ? 300 + rank * 1200 : 250
  })

  return (
    <Frame label={label}>
      <style>{POST_CSS + css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <SiteHeader lang={lang} setLang={setLang} color={color} on={seen} />

        <div
          ref={scrollerRef}
          className="i3-scroll absolute inset-x-0 bottom-0 overflow-x-hidden overflow-y-auto"
          style={{ top: "7.4cqw" }}
          tabIndex={0}
          aria-label={label}
        >
          <main key={key} lang={tagOf(lang)} className="h2-reset" style={{ marginLeft: "28cqw", width: `${COL}cqw`, paddingTop: "6.4cqw" }}>
            <div data-soft>
              <Article
                slug={slug}
                lang={lang}
                col={COL}
                color={color}
                wash={wash}
                on={on}
                delay={delay}
                rectKey={key}
                aside={aside?.(ctx)}
                afterParagraph={afterParagraph ? (p) => afterParagraph(p, ctx) : undefined}
                pen={pen ? (a) => pen(a, ctx) : undefined}
                notes={notes ? (a) => notes(a, ctx) : undefined}
                after={<ReadNext slug={slug} lang={lang} onFollow={follow} color={color} inked={inkedNext?.(ctx)} />}
              />
            </div>
          </main>
          <AddressFooter lang={lang} color={color} style={{ marginTop: "8cqw", padding: "4.4cqw 0 3cqw 28cqw", fontSize: "2.3cqw" }} />
        </div>

        <Rail lang={lang} items={m.rail} active={active} onGo={go}>
          {toggle ? <PenToggle pen={penOn} setPen={setPen} lang={lang} color={color} /> : null}
        </Rail>
      </div>
    </Frame>
  )
}
