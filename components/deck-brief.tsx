"use client"

import { boxPath, deckInk, deckRust } from "@/lib/deck-draw"

/**
 * Morgenbriefen, tegnet som det arket den er. Dekket har vist mye rørlegging og
 * lite leveranse — dette er det eneste stedet salen får se hva maskinen faktisk
 * rekker deg, så linjene er ekte og lesbare, ikke skjelettstreker.
 *
 * Ole og Nordvik Bygg er de samme som ble skrevet inn på lysbilde 9. Det som
 * gikk inn i braindumpen kommer ut igjen her, to lysbilder senere.
 *
 * Ingen bevegelse her. Lysbilde 9 skriver og 10 sender — et tredje bilde som
 * rører på seg ville bare konkurrert med det som står på arket.
 */


const PAGE = { x: 22, y: 30, w: 356, h: 290 }

/**
 * Ekte morgenbriefer er knappe og fulle av tall — ikke prosa. Hver linje her er
 * en sak en næringsmegler ville handlet på samme dag, og hver rustlinje er det
 * du ikke visste: hvor lenge gårdeieren har eid, hvor mange dager du har brukt,
 * hva som ble utdatert i natt.
 *
 * Ole og Nordvik Bygg er de samme som ble skrevet inn på lysbilde 9. Det som
 * gikk inn i braindumpen kommer ut igjen her, to lysbilder senere.
 *
 * Siste punkt er poenget: to henvendelser om samme bygg, tre uker fra
 * hverandre, som ingen av menneskene så.
 */
const lines: Array<{ y: number; text: string; tone?: "deckRust" }> = [
  { y: 106, text: "Sjøgata 12: leiekontrakt ut om 11 måneder." },
  { y: 126, text: "Gårdeier har eid siden 2009.", tone: "deckRust" },
  { y: 160, text: "Ole i Nordvik Bygg venter på svar om 600 kvm." },
  { y: 180, text: "Ni dager siden du lovte å ringe.", tone: "deckRust" },
  { y: 214, text: "Styringsrenta falt 0,25 i går." },
  { y: 234, text: "Sju yield-beregninger er utdaterte.", tone: "deckRust" },
  { y: 268, text: "Hansen og Berg har begge spurt om Havneveien 4." },
  { y: 288, text: "Tre uker fra hverandre.", tone: "deckRust" },
]

/** Én lik markør per punkt. Uthevingen ligger i fargen på andrelinja. */
const marks = [102, 156, 210, 264]

export function DeckBrief({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 350"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <path
        d={boxPath(PAGE.x, PAGE.y, PAGE.w, PAGE.h)}
        stroke={deckInk}
        strokeOpacity={0.55}
        strokeWidth={1.2}
      />

      <text
        x={42}
        y={61}
        fill={deckRust}
        fontSize={11.5}
        letterSpacing={1.9}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        MANDAG 07:00
      </text>
      <path d="M 42 75 H 358" stroke={deckInk} strokeOpacity={0.18} strokeWidth={1} />

      {marks.map((y) => (
        <path key={y} d={`M 42 ${y} h 10`} stroke={deckRust} strokeWidth={1.6} />
      ))}

      {lines.map((line) => (
        <text
          key={line.text}
          x={60}
          y={line.y}
          fill={line.tone === "deckRust" ? deckRust : deckInk}
          fontSize={13.5}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {line.text}
        </text>
      ))}
    </svg>
  )
}
