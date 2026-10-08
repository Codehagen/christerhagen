"use client"

// Prototypen dekket ble valgt fra: tre layouter over det samme innholdet, bak
// en velger. Står igjen med vilje, så salen kan se hvordan dekket ble til.
// Valget og det som ble forkastet står i ../BESLUTNING.md.

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { AvisStage } from "../_dekk/avis"
import { Deck } from "../_dekk/engine"
import { KontrollromStage } from "../_dekk/kontrollrom"
import { PlakatStage } from "../_dekk/plakat"

const variants = [
  { name: "Avis", Stage: AvisStage },
  { name: "Kontrollrom", Stage: KontrollromStage },
  { name: "Plakat", Stage: PlakatStage },
]

/* ---------------------------------------------------------------- the picker */

const pickerCss = `
.proto-picker{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;background:rgba(10,10,10,.82);-webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4);box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 8px 24px rgba(0,0,0,.24),0 2px 6px rgba(0,0,0,.12);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;line-height:1;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
.proto-picker-highlight{position:absolute;top:4px;left:0;height:28px;border-radius:999px;background:rgba(255,255,255,.12);will-change:transform}
.proto-picker[data-ready] .proto-picker-highlight{transition:transform 250ms cubic-bezier(.23,1,.32,1),width 250ms cubic-bezier(.23,1,.32,1)}
@media (prefers-reduced-motion:reduce){.proto-picker[data-ready] .proto-picker-highlight{transition:none}}
.proto-picker-item{position:relative;display:flex;align-items:center;height:28px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.55);font:inherit;cursor:pointer;transition:color 150ms ease-out}
.proto-picker-item:hover{color:rgba(255,255,255,.85)}
.proto-picker-item:active{transform:scale(.97)}
.proto-picker-item:focus-visible{outline:2px solid rgba(255,255,255,.4);outline-offset:2px}
.proto-picker-item[data-active]{color:#fff}
`

export default function ProtoPbl() {
  const [current, setCurrent] = useState(0)
  const [ready, setReady] = useState(false)
  const items = useRef<Array<HTMLButtonElement | null>>([])
  const highlight = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const v = Number(new URLSearchParams(location.search).get("v"))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- throwaway harness: read ?v= once on mount
    if (v >= 1 && v <= variants.length) setCurrent(v - 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
  }, [])

  useLayoutEffect(() => {
    const move = () => {
      const el = items.current[current]
      if (!el || !highlight.current) return
      highlight.current.style.width = `${el.offsetWidth}px`
      highlight.current.style.transform = `translateX(${el.offsetLeft}px)`
    }
    move()
    window.addEventListener("resize", move)
    return () => window.removeEventListener("resize", move)
  }, [current])

  const select = (i: number) => {
    setCurrent(i)
    const url = new URL(location.href)
    url.searchParams.set("v", String(i + 1))
    history.replaceState(null, "", url)
  }

  // Arrow keys belong to the deck itself, so the picker only takes 1–3.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number.parseInt(e.key, 10)
      if (n >= 1 && n <= variants.length) select(n - 1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const variant = variants[current]

  return (
    <>
      <style>{pickerCss}</style>
      <Deck key={current} Stage={variant.Stage} storageKey="proto:pbl:new" />
      <nav className="proto-picker" aria-label="Prototype variants" data-ready={ready ? "" : undefined}>
        <span ref={highlight} className="proto-picker-highlight" aria-hidden="true" />
        {variants.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              items.current[i] = el
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === current ? "" : undefined}
            aria-current={i === current ? "true" : undefined}
            onClick={(e) => {
              select(i)
              e.currentTarget.blur()
            }}
          >
            {v.name}
          </button>
        ))}
      </nav>
    </>
  )
}
