"use client"

import { boxPath, deckInk, deckRust } from "@/lib/deck-draw"

/**
 * En side i hjernen, slik den faktisk ser ut: en vanlig tekstfil du kan åpne og
 * lese. Det er halve poenget på scenen — folk tror en «company brain» er en
 * svart boks, og så er det markdown.
 *
 * De to nye linjene lander ett sekund fra hverandre, én over streken og én
 * under, og det er hele lagringsregelen vist i stedet for forklart: øverst
 * skrives det om, nederst legges det til.
 */

const mono = { fontFamily: "var(--font-mono)" } as const
const serif = { fontFamily: "var(--font-serif)" } as const

const naa = [
  { y: 116, text: "Daglig leder i Nordvik Bygg." },
  { y: 138, text: "Har eid Sjøgata 12 siden 2009." },
  { y: 160, text: "Ser etter 600 kvm i Bodø.", ny: 520 },
]

const historikk = [
  { y: 268, date: "24.08", text: "Telefon. 600 kvm, før sommeren.", ny: 1080 },
  { y: 292, date: "11.06", text: "Møte om Sjøgata 12." },
  { y: 316, date: "02.03", text: "Første kontakt." },
]

function New({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <g
      className="animate-in fade-in-0 duration-500 [animation-fill-mode:backwards] motion-reduce:animate-none"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </g>
  )
}

export function DeckPage({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 360"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <path d={boxPath(10, 0, 380, 348)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />

      <text x={30} y={34} fill={deckInk} fillOpacity={0.55} fontSize={11.5} letterSpacing={1.2} style={mono}>
        personer/ole-nordvik.md
      </text>
      <path d="M 30 48 H 370" stroke={deckInk} strokeOpacity={0.18} strokeWidth={1} />

      {/* over streken: hva som gjelder nå */}
      <text x={30} y={86} fill={deckRust} fontSize={11.5} letterSpacing={1.9} style={mono}>
        ## NÅ
      </text>
      {naa.map((line) =>
        line.ny ? (
          <New key={line.y} delay={line.ny}>
            <path d={`M 30 ${line.y - 5} h 8`} stroke={deckRust} strokeWidth={1.8} />
            <text x={48} y={line.y} fill={deckRust} fontSize={13} style={serif}>{line.text}</text>
          </New>
        ) : (
          <text key={line.y} x={48} y={line.y} fill={deckInk} fontSize={13} style={serif}>{line.text}</text>
        ),
      )}

      {/* streken */}
      <path d="M 30 200 H 370" stroke={deckInk} strokeOpacity={0.28} strokeWidth={1.2} />

      {/* under streken: hva som skjedde */}
      <text x={30} y={238} fill={deckRust} fontSize={11.5} letterSpacing={1.9} style={mono}>
        ## HISTORIKK
      </text>
      {historikk.map((row) => {
        const body = (
          <>
            <text
              x={48}
              y={row.y}
              fill={row.ny ? deckRust : deckInk}
              fillOpacity={row.ny ? 1 : 0.45}
              fontSize={11.5}
              letterSpacing={1}
              style={mono}
            >
              {row.date}
            </text>
            <text x={116} y={row.y} fill={row.ny ? deckRust : deckInk} fontSize={13} style={serif}>
              {row.text}
            </text>
          </>
        )
        return row.ny ? <New key={row.y} delay={row.ny}>{body}</New> : <g key={row.y}>{body}</g>
      })}
    </svg>
  )
}
