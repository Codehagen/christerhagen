"use client"

import { boxPath, deckInk, deckRust, deckGround } from "@/lib/deck-draw"

/**
 * De tre stegene, tegnet i stedet for forklart. Samme språk tre ganger, som
 * gjør stadig mer — og bevegelsen trapper opp i takt: steg 01 står helt stille,
 * 02 strekker seg utover, 03 setter seg selv sammen.
 */

const mono = { fontFamily: "var(--font-mono)" } as const
const LABEL = { fontSize: 11, letterSpacing: 1.8, style: mono } as const

function Row({ x, y, w, o = 0.16 }: { x: number; y: number; w: number; o?: number }) {
  return <path d={`M ${x} ${y} h ${w}`} stroke={deckInk} strokeOpacity={o} strokeWidth={2.4} />
}

/* ── 01 · Chatten som ikke kjenner deg ─────────────────────────────────── */

/**
 * Én gjennomkjøring når lysbildet kommer opp, ikke en løkke: spørsmålet, en
 * tenkepause, svaret som strømmer ut — og først da dukker den stiplede boksen
 * opp. Rekkefølgen er poenget. Salen ser samtalen skje, og oppdager *etterpå*
 * at alt de eier ligger urørt under den.
 */
function Stroke({
  d,
  delay,
  color,
  width = 2.4,
  opacity = 1,
}: {
  d: string
  delay: number
  color: string
  width?: number
  opacity?: number
}) {
  return (
    <path
      d={d}
      pathLength={1}
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeDasharray="1 1"
      strokeDashoffset={0}
      className="motion-reduce:!animate-none"
      style={{
        animation: "deck-stream 420ms var(--ease-out-quart) backwards",
        animationDelay: `${delay}ms`,
      }}
    />
  )
}

export function StepChat({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 420 400" fill="none" preserveAspectRatio="xMidYMid meet" className={className}>
      <path d={boxPath(90, 0, 240, 180)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />
      <text x={104} y={26} fill={deckRust} {...LABEL}>CHAT</text>
      <path d="M 104 38 H 316" stroke={deckInk} strokeOpacity={0.18} strokeWidth={1} />

      {/* det du spør om */}
      <Stroke d="M 226 62 h 90" delay={260} color={deckRust} width={2.6} />
      <Stroke d="M 256 76 h 60" delay={360} color={deckRust} width={2.6} />

      {/* den tenker */}
      <rect
        x={104}
        y={102}
        width={7}
        height={13}
        fill={deckRust}
        opacity={0}
        className="motion-reduce:hidden"
        style={{ animation: "deck-caret 760ms linear 500ms backwards" }}
      />

      {/* svaret: godt, men helt generelt */}
      {[[110, 200], [124, 178], [138, 196], [152, 118]].map(([y, w], row) => (
        <Stroke
          key={y}
          d={`M 104 ${y} h ${w}`}
          delay={1120 + row * 170}
          color={deckInk}
          opacity={0.16}
        />
      ))}

      {/* og først nå oppdager du hva den aldri rørte */}
      <g
        className="animate-in fade-in-0 duration-700 [animation-fill-mode:backwards] motion-reduce:animate-none"
        style={{ animationDelay: "2120ms" }}
      >
        <path
          d={boxPath(40, 250, 340, 140)}
          stroke={deckInk}
          strokeOpacity={0.3}
          strokeWidth={1.2}
          strokeDasharray="7 7"
        />
        <text x={58} y={276} fill={deckInk} fillOpacity={0.5} {...LABEL}>DIN BEDRIFT</text>
        {[[306, 300], [322, 244], [338, 288], [354, 196], [370, 262]].map(([y, w]) => (
          <Row key={y} x={58} y={y} w={w} o={0.11} />
        ))}
      </g>
    </svg>
  )
}

/* ── 02 · Agenten som griper ut etter verktøyene ───────────────────────── */

const tools = [
  { label: "E-POST", y: 40, d: "M 152 197 H 216 V 72 H 278", delay: "0s" },
  { label: "FILER", y: 150, d: "M 152 197 H 278", delay: "2.2s" },
  { label: "KALENDER", y: 260, d: "M 152 197 H 216 V 292 H 278", delay: "4.4s" },
]

export function StepAgent({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 420 400" fill="none" preserveAspectRatio="xMidYMid meet" className={className}>
      {/* agenten er en side med tekst — derfor ser den ut som en side med tekst */}
      <path d={boxPath(0, 142, 152, 110)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />
      <text x={16} y={168} fill={deckRust} {...LABEL}>AGENT.MD</text>
      {[[16, 192, 118], [16, 206, 96], [16, 220, 110], [16, 234, 72]].map(([x, y, w]) => (
        <Row key={y} x={x} y={y} w={w} />
      ))}

      {tools.map((tool) => (
        <g key={tool.label}>
          <path d={tool.d} stroke={deckInk} strokeOpacity={0.28} strokeWidth={1.2} />
          <path d={boxPath(278, tool.y, 142, 64)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />
          <text x={294} y={tool.y + 26} fill={deckRust} {...LABEL}>{tool.label}</text>
          <Row x={294} y={tool.y + 44} w={110} />
          <g
            className="motion-reduce:hidden"
            style={{
              offsetPath: `path("${tool.d}")`,
              offsetRotate: "0deg",
              offsetDistance: "0%",
              opacity: 0,
              animation: "deck-packet 6.6s linear infinite",
              animationDelay: tool.delay,
            }}
          >
            <rect x={-7} y={-5} width={14} height={10} fill={deckGround} stroke={deckRust} strokeWidth={1.4} />
          </g>
        </g>
      ))}
      <circle cx={152} cy={197} r={2.2} fill={deckInk} fillOpacity={0.45} />
    </svg>
  )
}

/* ── 03 · To skjermer, én kilde ────────────────────────────────────────── */

const screens = [
  {
    label: "ANSATT 1",
    x: 0,
    wire: "M 130 296 V 250 H 95 V 192",
    blocks: [
      { y: 60, h: 46, rows: 2 },
      { y: 118, h: 30, rows: 1 },
      { y: 158, h: 24, rows: 1 },
    ],
  },
  {
    label: "ANSATT 2",
    x: 230,
    wire: "M 290 296 V 250 H 325 V 192",
    blocks: [
      { y: 60, h: 24, rows: 1 },
      { y: 96, h: 62, rows: 3 },
      { y: 170, h: 12, rows: 0 },
    ],
  },
]

export function StepUI({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 420 400" fill="none" preserveAspectRatio="xMidYMid meet" className={className}>
      {screens.map((screen, side) => (
        <g key={screen.label}>
          <path d={screen.wire} stroke={deckInk} strokeOpacity={0.28} strokeWidth={1.2} />
          <path d={boxPath(screen.x, 0, 190, 192)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />
          <text x={screen.x + 16} y={34} fill={deckRust} {...LABEL}>{screen.label}</text>
          <path d={`M ${screen.x + 16} 44 H ${screen.x + 174}`} stroke={deckInk} strokeOpacity={0.18} strokeWidth={1} />
          {screen.blocks.map((block, index) => (
            <g
              key={block.y}
              className="animate-in fade-in-0 duration-500 [animation-fill-mode:backwards] motion-reduce:animate-none"
              style={{ animationDelay: `${260 + index * 150 + side * 90}ms` }}
            >
              <path
                d={boxPath(screen.x + 16, block.y, 158, block.h, 1.6)}
                stroke={deckRust}
                strokeOpacity={0.5}
                strokeWidth={1.1}
              />
              {Array.from({ length: block.rows }, (_, row) => (
                <Row key={row} x={screen.x + 28} y={block.y + 18 + row * 14} w={row % 2 ? 92 : 132} o={0.2} />
              ))}
            </g>
          ))}
        </g>
      ))}

      <path d={boxPath(60, 296, 300, 84)} stroke={deckInk} strokeWidth={1.3} />
      <text x={78} y={322} fill={deckInk} {...LABEL}>DINE DATA</text>
      {[[78, 344, 264], [78, 360, 198]].map(([x, y, w]) => (
        <Row key={y} x={x} y={y} w={w} o={0.2} />
      ))}
    </svg>
  )
}
