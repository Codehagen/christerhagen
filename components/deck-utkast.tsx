"use client"

import { boxPath, deckInk, deckRust } from "@/lib/deck-draw"

/**
 * Reglene fra forrige lysbilde, kjørt én gang på en ekte sak.
 *
 * Dette er første og eneste gang i hele dekket at noe går UT, til et menneske
 * utenfor kontoret. Alt annet vi har vist er rørlegging: ting som går inn, ting
 * som ligger lagret, ting som kommer tilbake til deg selv. En sal tåler mye
 * rørlegging hvis den til slutt får se hva som kommer ut av røret.
 *
 * Fotnotene er hele poenget. Hver påstand i e-posten har et tall, og tallet
 * peker på sida i hjernen den kom fra. Lysbilde 21 påstår at den aldri finner
 * på et tall; her kan salen kontrollere det selv i stedet for å tro på det.
 *
 * Og hver eneste opplysning i utkastet har salen sett før: 600 kvm og fredagen
 * ble skrevet inn på lysbilde 13, Havneveien 4 sto i morgenbriefen på 16. Det
 * er derfor eksempelet virker. De kontrollerer det mot sitt eget minne.
 *
 * Linjene tones inn, de skrives ikke. Skrivemaskinen på lysbilde 13 er en hånd
 * på et tastatur, og den signaturen tilhører mennesket. Gir vi maskinen samme
 * bevegelse, sier bildet at de to er samme sort, og det er stikk i strid med
 * det foredraget nettopp har brukt to lysbilder på å skille.
 *
 * Én gjennomkjøring, ikke en sløyfe. Dette skjedde én gang, en torsdag.
 */

const mono = { fontFamily: "var(--font-mono)" } as const
const serif = { fontFamily: "var(--font-serif)" } as const

/** Alt tonet inn står ferdig tegnet i grunntilstanden, så reduced motion mister ingenting. */
function Reveal({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <g
      className="animate-in fade-in-0 duration-500 [animation-fill-mode:backwards] motion-reduce:animate-none"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </g>
  )
}

/** En side i hjernen som ble slått opp, med fotnotetallet den fikk. */
function Kilde({ n, y, file, delay }: { n: number; y: number; file: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <text x={0} y={y} fill={deckRust} fontSize={11} style={mono}>
        {n}
      </text>
      <text x={16} y={y} fill={deckInk} fillOpacity={0.7} fontSize={10} style={mono}>
        {file}
      </text>
    </Reveal>
  )
}

function Linje({ y, children }: { y: number; children: string }) {
  return (
    <text x={212} y={y} fill={deckInk} fontSize={12} style={serif}>
      {children}
    </text>
  )
}

/** Fotnoten i margen, utenfor arket, der en korrekturleser ville satt den. */
function Fotnote({ n, y }: { n: number; y: number }) {
  return (
    <text x={180} y={y} fill={deckRust} fontSize={11} style={mono}>
      {n}
    </text>
  )
}

export function DeckUtkast({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 460 400"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {/* det Ole faktisk sa. Premisset, så det står der fra første bilde. */}
      <text x={0} y={14} fill={deckRust} fontSize={11} letterSpacing={1.8} style={mono}>
        OLE, PÅ TELEFON
      </text>
      <text x={0} y={40} fill={deckInk} fontSize={13.5} style={serif}>
        «Vi trenger 600 kvm i Bodø før sommeren.»
      </text>

      {/* hjernen slås opp i, én side av gangen */}
      <text x={0} y={88} fill={deckRust} fontSize={11} letterSpacing={1.8} style={mono}>
        HJERNEN
      </text>
      <path d="M 0 98 H 156" stroke={deckInk} strokeOpacity={0.18} strokeWidth={1} />
      <Kilde n={1} y={124} file="personer/ole-nordvik.md" delay={200} />
      <Kilde n={2} y={156} file="bygg/havneveien-4.md" delay={500} />
      <Kilde n={3} y={188} file="historikk/24.08.md" delay={800} />

      <path d="M 156 150 H 196" stroke={deckInk} strokeOpacity={0.28} strokeWidth={1.2} />
      <circle cx={156} cy={150} r={2} fill={deckInk} fillOpacity={0.45} />

      {/* arket står ferdig oppslått fra første bilde. Bare teksten kommer. */}
      <path d={boxPath(196, 70, 258, 244)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />
      <text x={212} y={96} fill={deckRust} fontSize={11} letterSpacing={1.8} style={mono}>
        UTKAST
      </text>
      <path d="M 212 106 H 438" stroke={deckInk} strokeOpacity={0.18} strokeWidth={1} />

      <Reveal delay={1200}>
        <Linje y={138}>Hei Ole,</Linje>
      </Reveal>
      <Reveal delay={1450}>
        <Fotnote n={1} y={170} />
        <Linje y={170}>Takk for praten. Dere trenger 600 kvm</Linje>
        <Linje y={190}>i Bodø før sommeren.</Linje>
      </Reveal>
      <Reveal delay={1750}>
        <Fotnote n={2} y={222} />
        <Linje y={222}>Havneveien 4 blir ledig til høsten.</Linje>
        <Linje y={242}>680 kvm, samme område.</Linje>
      </Reveal>
      <Reveal delay={2050}>
        <Fotnote n={3} y={274} />
        <Linje y={274}>Jeg ringer på fredag, som avtalt.</Linje>
      </Reveal>

      {/* Og så stopper det. Knappen er tegnet, ingenting trykker på den, og det
          er den eneste riktige sluttilstanden for dette lysbildet. */}
      <Reveal delay={2450}>
        <path d={boxPath(196, 340, 84, 30, 1.6)} stroke={deckRust} strokeWidth={1.3} />
        <text x={216} y={360} fill={deckRust} fontSize={11} letterSpacing={1.8} style={mono}>
          SEND
        </text>
      </Reveal>
      <Reveal delay={2750}>
        <text x={296} y={360} fill={deckInk} fillOpacity={0.7} fontSize={12} style={serif}>
          Ingen har trykket ennå.
        </text>
      </Reveal>
    </svg>
  )
}
