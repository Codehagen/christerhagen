"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { EMAIL } from "@/lib/content"
import { cn } from "@/lib/utils"

const COPY: Record<
  Lang,
  { copy: string; copied: string; pen: string; manual: string; label: string }
> = {
  en: {
    copy: "Copy",
    copied: "Copied",
    pen: "copied",
    manual: "Selected. Press ⌘C to copy.",
    label: "Copy email address",
  },
  no: {
    copy: "Kopier",
    copied: "Kopiert",
    pen: "kopiert",
    manual: "Markert. Trykk ⌘C for å kopiere.",
    label: "Kopier e-postadressen",
  },
}

type CopyState = "idle" | "copied" | "manual"

/**
 * Write `text` to the clipboard and hold the confirmation for 1.5s; if the
 * clipboard refuses, select the element in `ref` for ⌘C and say so for 2.6s.
 */
export function useCopy(text: string, hold = 1500) {
  const [state, setState] = React.useState<CopyState>("idle")
  const ref = React.useRef<HTMLAnchorElement>(null)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const settle = React.useCallback(
    (s: CopyState) => {
      setState(s)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(
        () => setState("idle"),
        s === "manual" ? 2600 : hold
      )
    },
    [hold]
  )

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      settle("copied")
    } catch {
      const el = ref.current
      const sel = window.getSelection()
      if (el && sel) {
        const r = document.createRange()
        r.selectNodeContents(el)
        sel.removeAllRanges()
        sel.addRange(r)
      }
      settle("manual")
    }
  }, [text, settle])

  return { state, copy, ref }
}

/**
 * The address and its copy button (17 / 38, DESIGN.md §4 Footer). The
 * `mailto` address at 16px/520; the copy button turns to a check that draws
 * itself, `Copy` crossfades to `Copied`, the button takes the pen, and the pen
 * writes `copied` beside it. If the clipboard refuses, the address is
 * selected and a polite live line says to press ⌘C.
 *
 * `note` sits under the address in faint (the availability line) and gives
 * way to the ⌘C message.
 */
export function CopyAddress({
  lang,
  email = EMAIL,
  size = "lead",
  stacked = false,
  pen = true,
  note,
  className,
}: {
  lang: Lang
  email?: string
  /** `lead` (16px, the footer) or `body` (14px, the about sign-off). */
  size?: "lead" | "body"
  /** Phone: the button under the address. */
  stacked?: boolean
  /** Whether the pen writes "copied" beside the button. */
  pen?: boolean
  note?: React.ReactNode
  className?: string
}) {
  const { state, copy, ref } = useCopy(email)
  const t = COPY[lang]
  const done = state === "copied"

  return (
    <div className={className}>
      <div
        className={cn(
          "flex flex-wrap",
          stacked
            ? "flex-col items-start gap-2"
            : "items-center gap-x-3 gap-y-2"
        )}
      >
        <a
          ref={ref}
          href={`mailto:${email}`}
          className={cn(
            "copy-mail hit font-[var(--weight-row)] tracking-[-0.012em] whitespace-nowrap",
            size === "lead" ? "text-lead" : "text-body"
          )}
        >
          {email}
        </a>
        <span className="relative flex items-center">
          <button
            type="button"
            onClick={copy}
            aria-label={done ? t.copied : t.label}
            className="copy-btn hit text-small"
            data-done={done || undefined}
            style={{ "--hw": "44px" } as React.CSSProperties}
          >
            <span aria-hidden className="relative block size-[1.05em]">
              <svg
                viewBox="0 0 16 16"
                className="copy-icon copy-glyph"
                fill="none"
              >
                <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
              </svg>
              <svg
                viewBox="0 0 16 16"
                className="copy-icon copy-check"
                fill="none"
              >
                <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
              </svg>
            </span>
            <span aria-hidden className="grid">
              <span className="copy-word" data-on={!done || undefined}>
                {t.copy}
              </span>
              <span className="copy-word" data-on={done || undefined}>
                {t.copied}
              </span>
            </span>
          </button>
          {pen ? (
            <span
              aria-hidden
              className="copy-pen absolute top-[-0.2em] left-[calc(100%+8px)] font-pen text-pen-lg"
              style={{ color: "var(--pen)" }}
              data-on={done || undefined}
            >
              {t.pen}
            </span>
          ) : null}
        </span>
      </div>
      <p
        aria-live="polite"
        className={cn(
          "mt-2.5 min-h-[1.4em] text-small",
          state === "manual" ? "text-ink" : "text-ink-faint"
        )}
      >
        {state === "manual" ? (
          t.manual
        ) : done ? (
          <>
            <span className="sr-only">{t.copied}. </span>
            {note}
          </>
        ) : (
          note
        )}
      </p>
    </div>
  )
}
