"use client"

import * as React from "react"
import Image from "next/image"

import { EMAIL, contactContent } from "@/lib/content"

import { useCopy } from "../../round-2/h/chrome"
import { AboutSite, Background, Bio, G, Head, PORTRAIT, Press, type Lang } from "./_about"

/**
 * 67 — The photo as the signature.
 *
 * Nothing above the words, and nothing in the column: the page reads as text
 * all the way down. It ends the way a letter does, with a sign-off in place
 * of 38's footer: a small portrait, cropped to the face, next to the name,
 * where he is, and the address with 17's copy. The rust pen rings About in
 * the band and writes "copied" beside the button; it does not sign.
 */

const RUST = "#C2410C"

const COPY: Record<Lang, { alt: string; copy: string; copied: string; pen: string; manual: string; label: string }> = {
  en: {
    alt: "Christer Hagen, smiling",
    copy: "Copy",
    copied: "Copied",
    pen: "copied",
    manual: "Selected. Press ⌘C to copy.",
    label: "Copy email address",
  },
  no: {
    alt: "Christer Hagen, smilende",
    copy: "Kopier",
    copied: "Kopiert",
    pen: "kopiert",
    manual: "Markert. Trykk ⌘C for å kopiere.",
    label: "Kopier e-postadressen",
  },
}

/** The sign-off: face, name, where, the address. The page's last word. */
function SignOff({ lang }: { lang: Lang }) {
  const { state, copy, ref } = useCopy(EMAIL)
  const t = COPY[lang]
  const done = state === "copied"

  return (
    <footer style={{ marginTop: "9cqw", borderTop: `1px solid ${G.hair}`, padding: "5.4cqw 0 8cqw" }}>
      <div style={{ marginLeft: "28cqw", width: "44cqw" }}>
        <div className="flex items-center" style={{ gap: "2.2cqw" }}>
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ width: "7.6cqw", height: "7.6cqw", borderRadius: "0.8cqw", boxShadow: `0 0 0 1px ${G.hair}`, background: "#2A2522" }}
          >
            <Image
              src={PORTRAIT}
              alt={t.alt}
              fill
              sizes="96px"
              className="object-cover"
              style={{ objectPosition: "center 40%", transform: "scale(2.1)", transformOrigin: "59% 38%" }}
            />
          </div>
          <div className="min-w-0">
            <p style={{ margin: 0, fontWeight: 560, letterSpacing: "-0.01em" }}>Christer Hagen</p>
            <p aria-live="polite" style={{ margin: "0.3cqw 0 0", fontSize: "1.75cqw", color: state === "manual" ? G.ink : G.grey }}>
              {state === "manual" ? t.manual : contactContent[lang].availability}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center" style={{ marginTop: "2.6cqw", gap: "1.2cqw 2cqw" }}>
          <a ref={ref} href={`mailto:${EMAIL}`} className="j-mail h2-hit" style={{ fontWeight: 520, letterSpacing: "-0.012em", whiteSpace: "nowrap" }}>
            {EMAIL}
          </a>
          <span className="relative flex items-center">
            <button
              type="button"
              onClick={copy}
              aria-label={done ? t.copied : t.label}
              className="h2-press h2-hit j-copy"
              data-done={done || undefined}
              style={{ fontSize: "1.85cqw", ["--hw" as string]: "44px" }}
            >
              <span aria-hidden className="relative block" style={{ width: "1.05em", height: "1.05em" }}>
                <svg viewBox="0 0 16 16" className="j-i j-glyph" fill="none">
                  <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                  <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
                </svg>
                <svg viewBox="0 0 16 16" className="j-i j-check" fill="none">
                  <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
                </svg>
              </span>
              <span aria-hidden className="grid">
                <span className="j-w" data-on={!done || undefined}>
                  {t.copy}
                </span>
                <span className="j-w" data-on={done || undefined}>
                  {t.copied}
                </span>
              </span>
            </button>
            <span aria-hidden className="j-copied absolute" data-on={done || undefined} style={{ left: "calc(100% + 1.2cqw)", top: "-0.4cqw", fontSize: "3.1cqw" }}>
              {t.pen}
            </span>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default function ThePhotoAsTheSignature() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")

  return (
    <AboutSite
      label="christerhagen.com/about, the portrait as the sign-off"
      pen={RUST}
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      footer={<SignOff lang={lang} />}
    >
      <section data-section>
        <Head lang={lang} />
        <Bio lang={lang} />
      </section>
      <Background lang={lang} />
      <Press lang={lang} />
    </AboutSite>
  )
}
