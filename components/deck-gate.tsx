"use client"

import { boxPath, deckInk, deckRust, deckGround } from "@/lib/deck-draw"

/**
 * Regelen tegnet i stedet for forklart: hjernen foreslår, disken slipper
 * gjennom, CRM-et tar imot. Flyten er loddrett og disken er vannrett, så
 * disken faktisk *sperrer* — den ligger på tvers av veien, ikke ved siden av.
 *
 * Hvilestillingen er lukket port. Det er hele poenget med lysbildet: ingenting
 * kommer inn av seg selv. Porten åpnes bare i de sekundene et menneske har
 * sagt ja, og lukker seg bak forslaget igjen.
 *
 * To gjennomkjøringer i sløyfa, ikke tre: ett forslag godkjennes, det neste
 * forkastes. Vekslingen er argumentet — hadde alt gått gjennom, hadde disken
 * vært pynt.
 *
 * Og det viktigste bildet er det som *ikke* beveger seg: arket står stille på
 * disken i 0,9 sekunder før det skjer noe. Den pausen er mennesket. Derfor er
 * reisen lineær og pausen ekte stillstand — ingen puls, ingen spinner, bare et
 * ark som venter på noen.
 */

const mono = { fontFamily: "var(--font-mono)" } as const
const serif = { fontFamily: "var(--font-serif)" } as const
const LABEL = { fontSize: 11, letterSpacing: 1.8, style: mono } as const

/** Én sløyfe = ett ja og ett nei. 3 s på hver, så salen rekker å lese begge. */
const CYCLE = "6s"

const RAIL = 102
const COUNTER = 214

/** Ned gjennom porten og inn i CRM-et. */
const PASS = `M ${RAIL} 76 V 344`
/** Ned til disken, og så ut av bildet igjen. */
const TURN = `M ${RAIL} 76 V 196 H -20`

/** Forslaget som reiser: et ark med to linjer tekst. Samme ark som connectorene
    sender, fordi det er det samme systemet. */
function Draft({ path, animation }: { path: string; animation: string }) {
  return (
    <g
      className="motion-reduce:hidden"
      style={{
        offsetPath: `path("${path}")`,
        offsetRotate: "0deg",
        offsetDistance: "0%",
        opacity: 0,
        animation: `${animation} ${CYCLE} linear infinite`,
      }}
    >
      <rect x={-9} y={-6.5} width={18} height={13} fill={deckGround} stroke={deckRust} strokeWidth={1.4} />
      <path d="M -5 -2 h 10" stroke={deckRust} strokeOpacity={0.55} strokeWidth={1.5} />
      <path d="M -5 1.5 h 6" stroke={deckRust} strokeOpacity={0.55} strokeWidth={1.5} />
    </g>
  )
}

/**
 * Stasjonene skriver seg selv: to linjer hver, der andrelinja er poenget.
 *
 * De to endene sier det motsatte av hverandre, men med ulik setningsform.
 * «Lov å ta feil» mot «ikke lov å ta feil» hadde vært penere, og fra rad femten
 * hadde halve salen mistet det ene ordet som bærer hele meningen. Ulik form
 * leses fortere enn en negasjon.
 */
function Note({ y, lead, point }: { y: number; lead: string; point: string }) {
  return (
    <>
      <text x={214} y={y} fill={deckInk} fontSize={13} style={serif}>
        {lead}
      </text>
      <text x={214} y={y + 18} fill={deckRust} fontSize={13} style={serif}>
        {point}
      </text>
    </>
  )
}

export function DeckGate({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 440 420"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {/* kabelen gjennom hele bildet — den går tvers gjennom disken */}
      <path d={`M ${RAIL} 76 V 344`} stroke={deckInk} strokeOpacity={0.28} strokeWidth={1.2} />

      {/* hjernen: rik, rotete, full av påstander */}
      <path d={boxPath(30, 8, 144, 68)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />
      <text x={44} y={34} fill={deckRust} {...LABEL}>HJERNEN</text>
      <path d="M 44 50 h 116" stroke={deckInk} strokeOpacity={0.16} strokeWidth={2.4} />
      <path d="M 44 60 h 88" stroke={deckInk} strokeOpacity={0.16} strokeWidth={2.4} />
      <circle cx={RAIL} cy={76} r={2} fill={deckInk} fillOpacity={0.45} />
      <Note y={36} lead="Alt noen har sagt." point="Her er det lov å ta feil." />

      {/* disken: en strek på tvers av veien */}
      <path d={`M 3 ${COUNTER} H 90`} stroke={deckInk} strokeWidth={1.4} />
      <path d={`M 114 ${COUNTER} H 201`} stroke={deckInk} strokeWidth={1.4} />
      <circle cx={6} cy={COUNTER} r={2} fill={deckInk} fillOpacity={0.45} />
      <circle cx={198} cy={COUNTER} r={2} fill={deckInk} fillOpacity={0.45} />
      {/* under streken, ikke over: det forkastede arket feier ut på y=196 */}
      <text x={3} y={COUNTER + 20} fill={deckRust} {...LABEL}>DISKEN</text>

      {/* porten. Tegnet = lukket. Den åpner seg bare når noen har sagt ja. */}
      <path
        d={`M 90 ${COUNTER} H 114`}
        stroke={deckInk}
        strokeWidth={1.4}
        className="motion-reduce:!animate-none"
        style={{ animation: `deck-gate-open ${CYCLE} linear infinite` }}
      />
      <Note y={208} lead="Et menneske leser forslaget." point="Godkjenner, eller forkaster." />

      {/* avgjørelsen, i den ene ruta der den tas */}
      <path
        d="M 132 196 l 5 6 l 11 -14"
        stroke={deckRust}
        strokeWidth={2.2}
        opacity={0}
        className="motion-reduce:hidden"
        style={{ animation: `deck-gate-yes ${CYCLE} linear infinite` }}
      />
      <path
        d="M 133 190 l 13 13 M 146 190 l -13 13"
        stroke={deckRust}
        strokeWidth={2.2}
        opacity={0}
        className="motion-reduce:hidden"
        style={{ animation: `deck-gate-no ${CYCLE} linear infinite` }}
      />

      {/* CRM-et: rent, fordi bare det godkjente kom hit */}
      <circle cx={RAIL} cy={344} r={2} fill={deckInk} fillOpacity={0.45} />
      <path d={boxPath(30, 344, 144, 68)} stroke={deckInk} strokeWidth={1.3} />
      <text x={44} y={370} fill={deckRust} {...LABEL}>CRM-ET</text>
      <path d="M 44 386 h 116" stroke={deckInk} strokeOpacity={0.2} strokeWidth={2.4} />
      <path d="M 44 396 h 88" stroke={deckInk} strokeOpacity={0.2} strokeWidth={2.4} />
      <Note y={372} lead="Det vi opererer på." point="Her må alt stemme." />

      <Draft path={PASS} animation="deck-gate-pass" />
      <Draft path={TURN} animation="deck-gate-turn" />
    </svg>
  )
}
