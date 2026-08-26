"use client"

import { boxPath, deckInk, deckRust } from "@/lib/deck-draw"

/**
 * En agent, åpnet. Halve salen tror en agent er programvare noen har kjøpt, og
 * så er det en fil på fire avsnitt som hvem som helst kan lese. Derfor er dette
 * lysbildet en tekstfil og ikke et diagram: diagrammet ville sagt «det er et
 * system», og det er nettopp misforståelsen vi prøver å ta.
 *
 * Samme grep som `personer/ole-nordvik.md` på lysbilde 15. Ser de to filene like
 * ut, sier bildet at agenten og kunden er lagret på samme måte, av samme slag.
 * Det er sant, og det er beroligende.
 *
 * Advanti Salg med vilje. Den får sitt eget nærbilde senere i dekket, så salen
 * møter den to ganger og kjenner den igjen andre gangen.
 *
 * Bare siste seksjon beveger seg. Lysbildene rundt trapper opp bevegelse i takt
 * (chatten står stille, agenten strekker seg ut, skjermen setter seg sammen), og
 * en fjerde som også rører på seg ville konkurrert med den trappen. Én ting som
 * lander sent, og det er grensen — som er den eneste linja i fila folk ikke
 * forventer å finne der.
 */

const mono = { fontFamily: "var(--font-mono)" } as const
const serif = { fontFamily: "var(--font-serif)" } as const

/** Seksjonsoverskrift, samme form som markdown faktisk har. */
function Section({ y, children }: { y: number; children: string }) {
  return (
    <text x={30} y={y} fill={deckRust} fontSize={11.5} letterSpacing={1.9} style={mono}>
      {children}
    </text>
  )
}

function Line({ y, children }: { y: number; children: string }) {
  return (
    <text x={48} y={y} fill={deckInk} fontSize={13} style={serif}>
      {children}
    </text>
  )
}

export function DeckAgentFile({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <path d={boxPath(10, 0, 380, 388)} stroke={deckInk} strokeOpacity={0.55} strokeWidth={1.2} />

      <text x={30} y={34} fill={deckInk} fillOpacity={0.55} fontSize={11.5} letterSpacing={1.2} style={mono}>
        agenter/advanti-salg.md
      </text>
      <path d="M 30 48 H 370" stroke={deckInk} strokeOpacity={0.18} strokeWidth={1} />

      {/* hva den skal gjøre, skrevet som du ville sagt det til en nyansatt */}
      <Section y={86}>## JOBBEN</Section>
      <Line y={116}>Gå gjennom nye kjøpere hver morgen,</Line>
      <Line y={138}>mot alt vi har på selgersiden.</Line>
      <Line y={160}>Finner du et treff, legg det på bordet</Line>
      <Line y={182}>med begrunnelsen.</Line>

      {/* nøkkelen: det eneste som skiller den fra en chat */}
      <Section y={226}>## DU HAR LOV TIL</Section>
      <Line y={256}>å lese databasen</Line>
      <Line y={278}>å skrive i dagsrapporten</Line>

      {/* Grensen kommer et sekund for seint, med vilje. Salen har akkurat lest
          hva den får lov til, og rekker å tenke «men hvor stopper den». Så
          står svaret der. Det er billigere enn å si det. */}
      <g
        className="animate-in fade-in-0 duration-500 [animation-fill-mode:backwards] motion-reduce:animate-none"
        style={{ animationDelay: "1100ms" }}
      >
        <Section y={322}>## DU HAR IKKE LOV TIL</Section>
        <Line y={352}>å kontakte kunder</Line>
      </g>
    </svg>
  )
}
