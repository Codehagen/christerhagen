"use client"

import { boxPath, deckInk, deckRust, deckGround } from "@/lib/deck-draw"

/**
 * Tre kilder som renner inn i hjernen. Geometrien er hentet fra referansen —
 * kort på toppen, sidebanene som knekker inn mot midten, ett nav nederst — men
 * tegnet i dekkets eget språk: bare strek, ingen fyll, ingen skygge.
 *
 * Sidebanene lander på x=192 og x=228, ikke begge på 210, slik at de tre
 * linjene møtes ved siden av hverandre og ikke oppå hverandre.
 *
 * Bevegelsen er én side av gangen, ikke tre lysstriper i takt: et lite ark
 * glir ned kabelen, hjernen pulserer når det lander, så er det stille i et
 * halvsekund. Årsak og virkning, med pause imellom — det tåler å stå på en
 * skjerm bak noen som snakker i et minutt.
 */


const CARD_W = 120
const CARD_H = 88
const HUB = { x: 210, y: 300, r: 26 }

/** Én reise per 2,2 s, tre ruter — så syklusen er 6,6 s og pulsen 2,2 s. */
const CYCLE = "6.6s"
const TRAVEL_MS = 1780

const sources = [
  { x: 0, label: "Møter", rows: [96, 58, 84, 44] },
  { x: 150, label: "E-post", rows: [96, 72, 52, 88] },
  { x: 300, label: "Kalender", rows: [96, 48, 80, 66] },
]

const routes = [
  { d: "M 60 88 V 158 H 192 V 281", delay: "0s" },
  { d: "M 210 88 V 274", delay: "2.2s" },
  { d: "M 360 88 V 158 H 228 V 281", delay: "4.4s" },
]

/** Arket som reiser. Papirfyll, så det dekker kabelen det glir langs. */
function Packet({ d, delay }: { d: string; delay: string }) {
  return (
    <g
      className="motion-reduce:hidden"
      style={{
        offsetPath: `path("${d}")`,
        offsetRotate: "0deg",
        offsetDistance: "0%",
        opacity: 0,
        animation: `deck-packet ${CYCLE} linear infinite`,
        animationDelay: delay,
      }}
    >
      <rect x={-8} y={-6} width={16} height={12} fill={deckGround} stroke={deckRust} strokeWidth={1.4} />
      <path d="M -4.5 -1.5 h 9" stroke={deckRust} strokeOpacity={0.55} strokeWidth={1.5} />
      <path d="M -4.5 2 h 5.5" stroke={deckRust} strokeOpacity={0.55} strokeWidth={1.5} />
    </g>
  )
}

export function DeckConnectors({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 420 450"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {sources.map((source) => (
        <g key={source.label}>
          <path
            d={boxPath(source.x, 0, CARD_W, CARD_H)}
            stroke={deckInk}
            strokeOpacity={0.55}
            strokeWidth={1.2}
          />
          <text
            x={source.x + 12}
            y={25}
            fill={deckRust}
            fontSize={12}
            letterSpacing={1.7}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {source.label.toUpperCase()}
          </text>
          {source.rows.map((width, row) => (
            <path
              key={row}
              d={`M ${source.x + 12} ${45 + row * 9} h ${width}`}
              stroke={deckInk}
              strokeOpacity={0.16}
              strokeWidth={2.4}
            />
          ))}
        </g>
      ))}

      {/* kablene */}
      {[...routes.map((route) => route.d), `M ${HUB.x} ${HUB.y + HUB.r} V 424`].map((d) => (
        <path key={d} d={d} stroke={deckInk} strokeOpacity={0.28} strokeWidth={1.2} />
      ))}

      {/* blekkpøl der pennen ble satt ned */}
      {[60, 210, 360].map((x) => (
        <circle key={x} cx={x} cy={CARD_H} r={2} fill={deckInk} fillOpacity={0.45} />
      ))}

      {/* hjernen svarer i det arket lander */}
      <circle
        cx={HUB.x}
        cy={HUB.y}
        r={HUB.r}
        stroke={deckRust}
        strokeWidth={1.4}
        className="motion-reduce:hidden"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          opacity: 0,
          animation: "deck-hub-pulse 2.2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite",
          animationDelay: `${TRAVEL_MS}ms`,
        }}
      />
      <circle cx={HUB.x} cy={HUB.y} r={HUB.r} stroke={deckInk} strokeWidth={1.4} />
      <circle
        cx={HUB.x}
        cy={HUB.y}
        r={HUB.r - 5.5}
        stroke={deckRust}
        strokeOpacity={0.5}
        strokeWidth={0.9}
      />
      <text
        x={HUB.x}
        y={HUB.y + HUB.r + 23}
        fill={deckInk}
        fontSize={11.5}
        letterSpacing={1.9}
        textAnchor="middle"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        HJERNEN
      </text>

      {routes.map((route) => (
        <Packet key={route.d} d={route.d} delay={route.delay} />
      ))}
    </svg>
  )
}
