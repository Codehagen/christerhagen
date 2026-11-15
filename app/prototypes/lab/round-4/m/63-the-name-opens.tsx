"use client"

import * as React from "react"

import { G, Crop, HomePage, Name, type Lang } from "./_home"

/**
 * 63 — The name opens.
 *
 * No photo on the page until you ask for one. The name is one of 07's
 * colourless links, like the companies in the paragraph under it: point at
 * it, focus it or tap it, and a small card opens under it with the
 * portrait, and the underline takes the pen. Leaving, blurring or Esc
 * closes it. The face is one gesture away, never in the way of the words.
 */

const PEN = "#0F766E"

const css = `
.m63-card { opacity: 0; translate: 0 0.6cqw; visibility: hidden;
  transition-property: opacity, translate, visibility; transition-duration: 160ms, 220ms, 0ms; transition-delay: 0ms, 0ms, 220ms;
  transition-timing-function: ease, cubic-bezier(.2,.7,.2,1), linear; }
.m63-card[data-on] { opacity: 1; translate: 0 0; visibility: visible; transition-delay: 0ms; }
@media (prefers-reduced-motion: reduce) {
  .m63-card { translate: none; transition-property: opacity, visibility; }
  .m63-card[data-on] { translate: none; }
}
`

function NameThatOpens({ lang }: { lang: Lang }) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="relative">
      <Name
        lang={lang}
        name={
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(true)}
            className="j-link h2-hit inline"
            data-on={open || undefined}
            style={{ font: "inherit", color: "inherit", ["--hw" as string]: "44px" }}
          >
            Christer Hagen
          </button>
        }
      />
      <div
        id={id}
        className="m63-card absolute z-10"
        data-on={open || undefined}
        style={{
          left: "-0.9cqw",
          top: "calc(100% + 1.2cqw)",
          padding: "0.9cqw",
          borderRadius: "1.4cqw",
          background: G.band,
          boxShadow: "0 0 0 1px rgba(18,18,18,0.07), 0 1px 2px rgba(18,18,18,0.04), 0 10px 28px -10px rgba(18,18,18,0.16)",
          pointerEvents: "none",
        }}
      >
        <span
          className="relative block overflow-hidden"
          style={{ width: "17cqw", aspectRatio: "4 / 5", borderRadius: "0.7cqw", background: "#2a2622" }}
        >
          <Crop cx={0.56} cy={0.44} span={0.62} aspect={0.8} sizes="360px" alt="Christer Hagen" eager className="object-cover" />
        </span>
      </div>
    </div>
  )
}

export default function TheNameOpens() {
  return (
    <HomePage
      label="christerhagen.com, the home page where the name opens a photo"
      pen={PEN}
      css={css}
      top={(lang) => <NameThatOpens lang={lang} />}
    />
  )
}
