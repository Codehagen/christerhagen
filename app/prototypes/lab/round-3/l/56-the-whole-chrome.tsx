"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { isPostSlug, postOrder, writingCopy } from "@/lib/posts"

import { useSeen } from "../../kit"
import { Frame } from "../../round-2/h/chrome"
import { Footer, Header, PageFor, Rail, SYSTEM_CSS, follow, hrefOf, railFor, tagOf, useRoute, useSpy } from "./system"

/**
 * 56 — The whole chrome, at desktop width.
 *
 * Header, rail and footer as one system over the site's real pages, scrolling
 * inside the tile. The header rings where you are (36) and the ring travels;
 * EN / NO are two grey letters. The rail (02) is the page's own contents at
 * 40% grey, and on a post it turns into the list of posts with "↩ All
 * writing" above it, while the header ring stays on Writing. Every page ends
 * in the footer, which is only the address with copy beside it (38); a post
 * ends in read next (19) first. One red pen: the ring.
 */

const RED = "oklch(0.56 0.2 27)"

export default function TheWholeChrome() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const scroller = React.useRef<HTMLDivElement>(null)
  const [route, go] = useRoute("writing", scroller)
  const [lang, setLang] = React.useState<Lang>("en")
  const spy = useSpy(scroller, `${route}-${lang}`)
  const rail = railFor(route, lang)
  const onPost = isPostSlug(route)

  const pick = (i: number) => {
    if (onPost) return go(postOrder[i])
    const band = scroller.current?.querySelector("header")?.offsetHeight ?? 0
    spy.go(i, band)
  }

  return (
    <Frame label="christerhagen.com with its header, rail and footer">
      <style>{SYSTEM_CSS}</style>
      <div ref={seenRef} className="absolute inset-0">
        <div ref={scroller} className="l3-scroll absolute inset-0 overflow-x-hidden overflow-y-auto" tabIndex={0} aria-label="The page, scrollable" style={{ outline: "none" }}>
          <Header route={route} lang={lang} setLang={setLang} go={go} color={RED} on={seen} />
          <div lang={tagOf(lang)} style={{ marginLeft: "27cqw", width: "50cqw" }}>
            <main key={`${route}-${lang}`} className="h2-reset" style={{ padding: "7.2cqw 0 9cqw" }}>
              <PageFor route={route} lang={lang} go={go} color={RED} />
            </main>
            <Footer lang={lang} color={RED} />
          </div>
        </div>

        <Rail
          key={onPost ? "posts" : route}
          label={rail.label}
          head={
            onPost ? (
              <a href={hrefOf("writing", lang)} onClick={follow(() => go("writing"))} className="h2-press h2-hit l3-back">
                ↩ {writingCopy[lang].backLabel}
              </a>
            ) : undefined
          }
          items={rail.items}
          active={onPost ? postOrder.indexOf(route) : spy.active}
          onPick={pick}
        />
      </div>
    </Frame>
  )
}
