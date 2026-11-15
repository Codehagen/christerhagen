"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { Stage, StageSheet } from "@/components/site/stage"

/**
 * Docdir's product on the wall (lab round-3/k/53): a full-bleed Stage with
 * the sales prospectus as the one shot. Four checks in the pen's green, grey
 * bars for the text, "Quality-checked" at the foot. The sheet sits on the
 * 48px lines: about 40% across on a wide page, centred on a phone.
 */

const CELL = 48
const W = 240
const H = 288

const COPY: Record<Lang, { title: string; foot: string; caption: string }> = {
  en: {
    title: "Sales prospectus",
    foot: "Quality-checked",
    caption:
      "The sales prospectus every Norwegian property sale depends on, checked.",
  },
  no: {
    title: "Salgsoppgave",
    foot: "Kvalitetssikret",
    caption:
      "Salgsoppgaven hver norske eiendomshandel er avhengig av, kontrollert.",
  },
}

const BARS = ["78%", "64%", "84%", "52%"]

function Shot({ lang }: { lang: Lang }) {
  const box = React.useRef<HTMLDivElement>(null)
  const [x, setX] = React.useState<number | null>(null)
  const t = COPY[lang]

  React.useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const place = () => {
      const w = el.clientWidth
      const at = Math.min(w * 0.4, (w - W) / 2)
      setX(Math.max(0, Math.round(at / CELL)) * CELL)
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={box} className="absolute inset-0">
      {x !== null ? (
        <StageSheet
          width={W}
          height={H}
          at={{ x, y: CELL }}
          className="gap-4 p-6"
        >
          <span className="text-lead leading-[1.2] font-[var(--weight-strong)]">
            {t.title}
          </span>
          {BARS.map((w, i) => (
            <span key={i} className="flex items-center gap-3">
              <svg viewBox="0 0 12 12" className="size-4 shrink-0">
                <path
                  d="M2 6.4 4.8 9 10 3"
                  fill="none"
                  stroke="var(--pen)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="block h-3 rounded-full"
                style={{ width: w, background: "rgb(var(--ink-rgb) / 0.075)" }}
              />
            </span>
          ))}
          <span className="mt-auto text-ui text-ink-muted">{t.foot}</span>
        </StageSheet>
      ) : null}
    </div>
  )
}

export function DocdirStage({
  lang,
  captionClassName,
}: {
  lang: Lang
  captionClassName?: string
}) {
  const t = COPY[lang]
  return (
    <Stage
      variant="full"
      label={
        lang === "en"
          ? `${t.title}: four checks passed. ${t.foot}.`
          : `${t.title}: fire kontroller bestått. ${t.foot}.`
      }
      caption={t.caption}
      captionClassName={captionClassName}
    >
      <Shot lang={lang} />
    </Stage>
  )
}
