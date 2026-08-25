"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { DeckBrief } from "@/components/deck-brief"
import { DeckPage } from "@/components/deck-page"
import { StepAgent, StepChat, StepUI } from "@/components/deck-steps"
import { DeckConnectors } from "@/components/deck-connectors"
import { DeckVisual } from "@/components/deck-visual"
import savedVisual from "@/data/deck-visual.json"
import {
  ORG_PLACE,
  visualPalettes,
  type DeckVisualConfig,
  type NodeFrame,
} from "@/lib/deck-visual"
import { orgChartLayout } from "@/lib/org-chart"

const visual = savedVisual as DeckVisualConfig
const paper = visualPalettes[visual.substrate]

/**
 * Blekket i typografien er det samme blekket som i tegningen — hentet fra
 * paletten generatoren tegner med, slik at de to aldri kan drifte fra hverandre.
 */
const ink = paper.primary
const rust = paper.secondary
const meta = "#6d6657" // site --ink-meta: klarer AA på papiret
const rule = "rgb(38 35 28 / 0.16)" // blekk med alpha: trekker seg tilbake i papiret

const display =
  "font-serif text-[clamp(3.2rem,7.2vw,8.4rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance"
const title =
  "font-serif text-[clamp(2.4rem,4.9vw,5.7rem)] leading-[0.98] font-semibold tracking-[-0.025em] text-balance"
const lead =
  "font-serif max-w-[34ch] text-[clamp(1.2rem,1.7vw,2rem)] leading-[1.34] text-pretty"
const label =
  "font-mono text-[clamp(0.68rem,0.78vw,0.92rem)] leading-none uppercase tracking-[0.17em]"

type Figure = {
  /** Prosent av figurens egen boks — bare transform, aldri layout. */
  x: number
  y: number
  scale: number
  opacity: number
  rotation: number
}

/**
 * Tallet glir mot målet i stedet for å hoppe dit. Rotasjonen er geometri, ikke
 * CSS, så den må animeres i JS — resten av forflytningen er en transform.
 */
function useEasedNumber(target: number, duration: number) {
  const [value, setValue] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const span = reduced ? 0 : duration
    const start = performance.now()
    const origin = from.current
    let frame = 0

    const tick = (now: number) => {
      const t = span === 0 ? 1 : Math.min(1, (now - start) / span)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = origin + (target - origin) * eased
      from.current = next
      setValue(Math.round(next * 2) / 2)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

/**
 * Meldinga skrives ut tegn for tegn. Pausene ligger på skilletegnene, ikke i en
 * tilfeldighetsgenerator — samme forestilling hver gang, og dette er en scene.
 */
function useTypewriter(text: string, speed: number, delay: number) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let timer = 0

    if (reduced) {
      timer = window.setTimeout(() => setCount(text.length), 0)
      return () => window.clearTimeout(timer)
    }

    // Rytmen ligger i tegnet som nettopp ble skrevet: hvil etter punktum, kort
    // pust etter komma, et lite opphold mellom ordene. Det er der en skrivende
    // hånd faktisk nøler — jevn takt høres ut som en skriver, ikke et menneske.
    const step = (index: number) => {
      setCount(index)
      if (index >= text.length) return
      const previous = text[index - 1]
      const pause =
        previous === "."
          ? speed * 10
          : previous === ","
            ? speed * 5
            : previous === " "
              ? speed * 2.2
              : speed
      timer = window.setTimeout(() => step(index + 1), pause)
    }

    timer = window.setTimeout(() => step(0), delay)
    return () => window.clearTimeout(timer)
  }, [text, speed, delay])

  return { count, done: count >= text.length }
}

/** Ett legeme for hele foredraget. Det snur seg og flytter seg — det byttes aldri ut. */
function TravellingSolid({ figure }: { figure: Figure }) {
  const rotation = useEasedNumber(figure.rotation, 900)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 right-0 z-0 aspect-square h-full transition-[transform,opacity] duration-[900ms] ease-out motion-reduce:transition-none"
      style={{
        transform: `translate(${figure.x}%, ${figure.y}%) scale(${figure.scale})`,
        opacity: figure.opacity,
      }}
    >
      <DeckVisual
        config={{ ...visual, rotation }}
        showGround={false}
        preserveAspectRatio="xMidYMid meet"
        idPrefix="deck-solid"
        className="size-full"
      />
    </div>
  )
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-[min(62%,58rem)] flex-col justify-center">
      {children}
    </div>
  )
}


/**
 * Slarken i diagrammene. 0 = linjal, 1.6 = samme skjelv som legemet. Blekket
 * (pøl i portene, overskyting i hjørnene, feilregister) står uansett.
 */
const ORG_WOBBLE = 0

/**
 * Viktor-boksen der den faktisk står i org-kartet, regnet ut fra den samme
 * layouten kartet tegnes fra. Boksen på org-lysbildet og boksen på nærbildet
 * er samme boks — den byttes ikke ut, den formes om.
 */
const hubBox = orgChartLayout(visual).boxes.find((box) => box.id === "viktor")!

const chartFrame: NodeFrame = {
  x: ORG_PLACE.x + hubBox.x * ORG_PLACE.scale,
  y: ORG_PLACE.y + hubBox.y * ORG_PLACE.scale,
  w: hubBox.w * ORG_PLACE.scale,
  h: hubBox.h * ORG_PLACE.scale,
  stub: 0,
  delegate: 0,
  label: 0,
  alpha: 1,
}

const closeFrame: NodeFrame = {
  x: 58,
  y: 168,
  w: 352,
  h: 200,
  stub: 42,
  delegate: 0,
  label: 1,
  alpha: 1,
}

const ceoCloseFrame: NodeFrame = { ...closeFrame, delegate: 1 }
const hidden: NodeFrame = { ...chartFrame, alpha: 0 }
const hiddenClose: NodeFrame = { ...closeFrame, alpha: 0, label: 0 }

function lerpFrame(from: NodeFrame, to: NodeFrame, t: number): NodeFrame {
  const mix = (a: number, b: number) => a + (b - a) * t
  return {
    x: mix(from.x, to.x),
    y: mix(from.y, to.y),
    w: mix(from.w, to.w),
    h: mix(from.h, to.h),
    stub: mix(from.stub, to.stub),
    delegate: mix(from.delegate, to.delegate),
    label: mix(from.label, to.label),
    alpha: mix(from.alpha, to.alpha),
  }
}

/** Boksen som overlever lysbildeskiftet. */
function MorphingNode({
  frame,
  nodeLabel,
}: {
  frame: NodeFrame
  nodeLabel?: { role: string; name: string }
}) {
  const current = useRef(frame)
  const [shown, setShown] = useState(frame)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const span = reduced ? 0 : 780
    const start = performance.now()
    const origin = current.current
    let raf = 0

    const tick = (now: number) => {
      const t = span === 0 ? 1 : Math.min(1, (now - start) / span)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = lerpFrame(origin, frame, eased)
      current.current = next
      setShown(next)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [frame])

  if (shown.alpha < 0.01) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2]">
      <DeckVisual
        config={{ ...visual, mode: "node", wobble: ORG_WOBBLE }}
        nodeFrame={shown}
        nodeLabel={nodeLabel}
        showGround={false}
        preserveAspectRatio="xMidYMid meet"
        idPrefix="morph"
        className="size-full"
      />
    </div>
  )
}

type Slide = {
  id: string
  label: string
  Content: () => React.ReactNode
  figure: Figure
  enter?: string
  node?: NodeFrame
  nodeLabel?: { role: string; name: string }
}

/* ----------------------------------------------------------- byggeklosser */

function Beats({
  items,
  wide = false,
}: {
  items: Array<[string, string]>
  wide?: boolean
}) {
  return (
    <ol className="m-0 mt-[3.4vh] grid list-none gap-0 p-0">
      {items.map(([key, text]) => (
        <li
          key={key}
          className={`grid ${
            wide ? "grid-cols-[10rem_1fr]" : "grid-cols-[6.5rem_1fr]"
          } items-baseline gap-x-[2vw] gap-y-1 border-t py-[clamp(0.8rem,1.5vh,1.5rem)] last:border-b`}
          style={{ borderColor: rule }}
        >
          <span className={`${label} tabular-nums`} style={{ color: rust }}>
            {key}
          </span>
          <span className="font-serif text-[clamp(1rem,1.35vw,1.6rem)] leading-[1.3] text-pretty">
            {text}
          </span>
        </li>
      ))}
    </ol>
  )
}

function Statement({
  eyebrow,
  heading,
  body,
  items,
  close,
  wide,
}: {
  eyebrow?: string
  heading: string
  body?: string
  items?: Array<[string, string]>
  close?: string
  wide?: boolean
}) {
  return (
    <Column>
      {eyebrow ? (
        <p className={label} style={{ color: rust }}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`${title} ${eyebrow ? "mt-[2.6vh]" : ""} max-w-[22ch]`}>{heading}</h2>
      {body ? (
        <p className={`${lead} mt-[3.4vh] max-w-[46ch]`} style={{ color: meta }}>
          {body}
        </p>
      ) : null}
      {items ? <Beats items={items} wide={wide} /> : null}
      {close ? (
        <p
          className="mt-[3vh] max-w-[58ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty"
          style={{ color: rust }}
        >
          {close}
        </p>
      ) : null}
    </Column>
  )
}

/** Tekst til venstre, bilde til høyre — samme rutenett på alle delte lysbilder. */
function Split({ children, figure }: { children: React.ReactNode; figure: React.ReactNode }) {
  return (
    <div className="grid h-full grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-[4.5vw]">
      <div className="flex flex-col justify-center">{children}</div>
      {figure}
    </div>
  )
}

/** Et diagram som fyller lysbildet, med overskriften over. */
function Diagram({
  heading,
  aside,
  mode,
}: {
  heading: string
  aside: string
  mode: "organisasjon" | "flyt"
}) {
  return (
    <div className="h-full">
      <div className="flex items-end justify-between gap-[4vw]">
        <h2 className="max-w-[28ch] font-serif text-[clamp(1.5rem,2.5vw,2.9rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-pretty">
          {heading}
        </h2>
        <p className={`${label} shrink-0 pb-[0.6vh] text-end`} style={{ color: rust }}>
          {aside}
        </p>
      </div>
      <DeckVisual
        config={{ ...visual, mode, wobble: ORG_WOBBLE }}
        omitCeoBox={mode === "organisasjon"}
        showGround={false}
        preserveAspectRatio="xMidYMid meet"
        idPrefix={`deck-${mode}`}
        className="absolute inset-0 size-full"
      />
    </div>
  )
}

/* --------------------------------------------------------------- lysbildene */

function Cover() {
  return (
    <div className="flex h-full w-[min(58%,54rem)] flex-col justify-center">
      <p className={label} style={{ color: rust }}>
        Næringsmegling · Bodø
      </p>
      <h1 className={`${display} mt-[3.5vh] max-w-[14ch]`}>
        Hvordan jeg bygde Advanti Estate.
      </h1>
      <p className={`${lead} mt-[4.5vh] max-w-[46ch]`} style={{ color: meta }}>
        Et helt vanlig meglerkontor, bygget om til et AI-native selskap — de
        første i Norge, kanskje i verden. Hva som skulle til, og hvor jeg tror
        dette går videre.
      </p>
    </div>
  )
}

function OmMeg() {
  return (
    <Statement
      eyebrow="Kort om meg"
      heading="Tolv selskaper. To fungerte."
      body="Jeg begynte å kode da jeg var tretten, og startet det første selskapet som attenåring. Det er sytten år siden. Treningsklær, markedsføring, programvare — rundt ni av ti av dem har feilet. I dag skriver jeg kode, og jeg driver et meglerkontor. De to tingene passer ikke sammen, og det er hele poenget."
      items={[
        ["2024", "Ble partner i Advanti Estate i Bodø."],
        ["2026", "Solgte Docdir til Visma. AI for salgsoppgaver i eiendom."],
      ]}
      close="Du trenger ikke ha rett så ofte. Du må bare holde på lenge nok til å få veldig rett noen få ganger."
    />
  )
}

function Bransjen() {
  return (
    <Statement
      eyebrow="Utgangspunktet"
      heading="Jobben er egentlig å huske."
      body="Hvem eier hva. Hva som ble avtalt. Hvem du lovte å ringe. Hvem som skal leie, hvem som skal kjøpe, hvem som har penger og hvem som ikke har det. Før skrev jeg det ned i en Excel-liste."
      close="Alle skriver ned. Og så skjer det ingenting mer."
    />
  )
}

function Grensa() {
  return (
    <Statement
      eyebrow="Grensa"
      heading="Vi glemmer. Det gjør ikke den."
      body="Et menneske holder noen få ting i hodet om gangen, og resten faller ut. Statusmøter, ukesrapporter, arkivskap, mellomledere — alt sammen finnes fordi ett hode ikke rekker over hele bedriften."
      items={[
        ["Deg", "Det du husker fra i går. Kanskje."],
        ["En agent", "Tusen sider åpne samtidig, og finner nåla i alle sammen."],
      ]}
      wide
      close="Vi har bygget hele arbeidslivet rundt den grensa. Og grensa flyttet seg akkurat."
    />
  )
}

function HvaJegTror() {
  return (
    <Statement
      eyebrow="Hva jeg tror"
      heading="Tre ting jeg tror om det som kommer."
      body="Jeg vet ikke hvordan dette ender. Ingen gjør det. Men tre ting tror jeg ganske sikkert."
      items={[
        ["01", "Selskaper blir ikke erstattet. De blir mindre."],
        ["02", "Det er midten som automatiseres. Ikke gulvet."],
        ["03", "Alle leier den samme modellen. Hjernen er det eneste dere eier."],
      ]}
      close="Og du er ikke for sent ute. Dette tar tjue år — det er ikke dårlige nyheter, det er vinduet."
    />
  )
}

function FirstPrinciples() {
  return (
    <Statement
      eyebrow="First principles"
      heading="Hva er jobben egentlig til for?"
      body="Næringsmegling har vært gjort likt i generasjoner. Så vi spurte ikke hvordan vi kunne gjøre det samme litt raskere — vi spurte hva målet er. Svaret var enkelt: finne kjøper og selger fort, og få informasjonen ut av selgeren enda fortere."
      items={[
        ["Teaseren", "En kort tekst som skal måle om noen er interessert."],
        ["Salgsoppgaven", "Alt om bygget, skrevet ut. Det tar uker."],
        ["Datarommet", "Informasjonen. Kommer helt til slutt."],
      ]}
      wide
      close="Det vi trenger først, kommer sist. Ingen har bestemt at det skal være sånn — det har bare alltid vært sånn."
    />
  )
}

function Snudd() {
  return (
    <Statement
      eyebrow="Resultatet"
      heading="Nå får kjøperen svar samme dag."
      body="Datarommet er ferdig fra dag én. Vi samler alt om bygget den dagen vi tar oppdraget, ikke den dagen noen spør — og det er en agent som gjør innsamlingen. Salgsoppgaven skriver ingen lenger; den hentes rett ut av det som allerede ligger der."
      close="Det tok tre uker før. Og hver bransje har en slik arvet rekkefølge — også deres."
    />
  )
}

function TreSteg() {
  return (
    <Statement
      eyebrow="Slik ser jeg AI"
      heading="Tre steg."
      body="De fleste av oss står på det første i dag. Vi jobber på det andre. Det tredje har ingen kommet til ennå."
      items={[
        ["01", "Du snakker med den."],
        ["02", "Den gjør jobben for deg."],
        ["03", "Skjermen lages rundt deg."],
      ]}
      close="Hvert steg opp krever mer av dataene dine enn det forrige. Det er derfor det tredje er så vanskelig — og så verdifullt."
    />
  )
}

function Steg1() {
  return (
    <Split figure={<StepChat className="h-[min(60vh,31rem)] w-full" />}>
      <p className={label} style={{ color: rust }}>Steg 01</p>
      <h2 className="mt-[2.4vh] max-w-[16ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">Du snakker med den.</h2>
      <p className={`${lead} mt-[3.2vh] max-w-[32ch]`} style={{ color: meta }}>
        Du skriver til ChatGPT og får et svar tilbake. Nesten alle er her nå, og
        det er en enorm forbedring fra ingenting.
      </p>
      <p className="mt-[3vh] max-w-[36ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty" style={{ color: rust }}>
        Men den vet ingenting om bedriften din, og husker ingenting til neste
        gang. Du gjør fortsatt hele jobben selv.
      </p>
    </Split>
  )
}

function Steg2() {
  return (
    <Split figure={<StepAgent className="h-[min(60vh,31rem)] w-full" />}>
      <p className={label} style={{ color: rust }}>Steg 02</p>
      <h2 className="mt-[2.4vh] max-w-[16ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">Den gjør jobben for deg.</h2>
      <p className={`${lead} mt-[3.2vh] max-w-[32ch]`} style={{ color: meta }}>
        I dag skriver du e-posten i ChatGPT og limer den inn selv. Steg to er at
        den skriver den, finner vedlegget og sender den. Du slutter å spørre og
        begynner å delegere.
      </p>
      <p className="mt-[3vh] max-w-[36ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty" style={{ color: rust }}>
        En agent er ikke et program. Det er en side med tekst som sier hva
        jobben er — og som har lov til å bruke verktøyene dine.
      </p>
    </Split>
  )
}

function Steg3() {
  return (
    <Split figure={<StepUI className="h-[min(60vh,31rem)] w-full" />}>
      <p className={label} style={{ color: rust }}>Steg 03</p>
      <h2 className="mt-[2.4vh] max-w-[16ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">Skjermen lages rundt deg.</h2>
      <p className={`${lead} mt-[3.2vh] max-w-[32ch]`} style={{ color: meta }}>
        To ansatte åpner det samme systemet: den ene ser regnskapstall, den
        andre noe helt annet. Begge skjermbildene bygges der og da.
      </p>
      <p className="mt-[3vh] max-w-[36ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty" style={{ color: rust }}>
        Da er det bare dataene dine som skiller dere fra alle andre. Gullet
        ligger inne i firmaet.
      </p>
    </Split>
  )
}

function Loop() {
  return (
    <Diagram
      mode="flyt"
      heading="Slik jobber vi med AI på kontoret."
      aside="Fire steg · og tilbake til start"
    />
  )
}

/** Slik en braindump faktisk ser ut: små bokstaver, ingen felter, ingen mal. */
const braindump =
  "ringte ole hos nordvik bygg nå. de vokser ut av lokalet og trenger 600 kvm i bodø før sommeren. skal ta det opp i styret neste uke. lovte å ringe tilbake fredag. han nevnte at broren driver noe lignende i mo."

const braindumpResultat: Array<[string, string]> = [
  ["Personen", "Ole er lagt inn, med det han sa."],
  ["Selskapet", "Nordvik Bygg hentet fra Brønnøysund. Org.nr, styre, roller."],
  ["Fredag", "Påminnelse. Du lovte å ringe."],
  ["Broren", "Eget spor i Mo. Det hadde jeg aldri skrevet ned selv."],
]

function Braindump() {
  const { count, done } = useTypewriter(braindump, 18, 420)

  return (
    <div className="grid h-full grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] items-center gap-[5vw]">
      <div className="flex flex-col justify-center">
        <p className={label} style={{ color: rust }}>
          Steg 1 · du skriver
        </p>
        <h2 className="mt-[2.4vh] max-w-[16ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">
          Fem setninger etter en telefon.
        </h2>
        <p className={`${lead} mt-[3.2vh] max-w-[32ch]`} style={{ color: meta }}>
          Ingen mal, ingen felter. Du skriver som du ville skrevet til en kollega.
        </p>
        <p
          className="mt-[3vh] max-w-[36ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty"
          style={{ color: rust }}
        >
          Vi skriver alle til den samme, og vi leser alle fra den.
        </p>
      </div>

      <div className="flex w-full max-w-[40rem] flex-col justify-center">
        <p className={`${label} flex items-baseline justify-between gap-6`} style={{ color: meta }}>
          <span>Det jeg skrev</span>
          <span className="tabular-nums">21:14</span>
        </p>

        {/* Hele meldinga står i teksten fra første bilde — det som skjer er at
            bokstavene slås på, ikke at de settes inn. Da er linjedelingen regnet
            ut én gang, og ingen ord hopper ned en linje mens det skrives.
            Markøren er tegnet som står for tur, ikke en boks ved siden av:
            null bredde i flyten, og ingenting kan brekke rundt den. */}
        <p
          aria-hidden="true"
          className="mt-[2.2vh] font-mono text-[clamp(0.8rem,1.02vw,1.22rem)] leading-[1.62] text-pretty"
          style={{ color: ink }}
        >
          <span>{braindump.slice(0, count)}</span>
          <span style={{ backgroundColor: rust, color: "transparent" }}>
            {braindump.slice(count, count + 1)}
          </span>
          <span className="opacity-0">{braindump.slice(count + 1)}</span>
        </p>
        <span className="sr-only">{braindump}</span>

        <div className="mt-[3.2vh] border-t pt-[2vh]" style={{ borderColor: rule }}>
          <p
            className={`${label} transition-opacity duration-300 ease-out motion-reduce:transition-none`}
            style={{ color: rust, opacity: done ? 1 : 0 }}
          >
            Det som skjedde
          </p>
          <ol className="m-0 mt-[1.4vh] grid list-none gap-0 p-0">
            {braindumpResultat.map(([key, text], position) => (
              <li
                key={key}
                className="grid grid-cols-[8.5rem_1fr] items-baseline gap-x-[1.6vw] border-t py-[clamp(0.5rem,1vh,1rem)] transition-[opacity,transform] duration-300 ease-out last:border-b motion-reduce:transition-none"
                style={{
                  borderColor: rule,
                  opacity: done ? 1 : 0,
                  transform: done ? "none" : "translateY(6px)",
                  transitionDelay: done ? `${140 + position * 320}ms` : "0ms",
                }}
              >
                <span className={`${label} tabular-nums`} style={{ color: rust }}>
                  {key}
                </span>
                <span className="font-serif text-[clamp(0.95rem,1.25vw,1.5rem)] leading-[1.3] text-pretty">
                  {text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

function Connectorer() {
  return (
    <div className="grid h-full grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-[4vw]">
      <div className="flex flex-col justify-center">
        <p className={label} style={{ color: rust }}>
          Steg 2 · den gjør resten
        </p>
        <h2 className="mt-[2.4vh] max-w-[18ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">
          Men det meste skriver vi ikke inn i det hele tatt.
        </h2>
        <p className={`${lead} mt-[3.2vh] max-w-[34ch]`} style={{ color: meta }}>
          En connector er en kobling til et sted vi allerede jobber — møtene,
          innboksen, kalenderen. Den henter det som skjer der, og legger det i
          hjernen uten at noen gjør noe.
        </p>
        <p
          className="mt-[3vh] max-w-[36ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty"
          style={{ color: rust }}
        >
          Et kvarter å koble på hver av dem. Så går de av seg selv.
        </p>
      </div>
      <DeckConnectors className="h-[min(66vh,34rem)] w-full" />
    </div>
  )
}

function Lagrer() {
  return (
    <Split figure={<DeckPage className="h-[min(60vh,32rem)] w-full" />}>
      <p className={label} style={{ color: rust }}>Steg 3 · den lagrer</p>
      <h2 className="mt-[2.4vh] max-w-[18ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">
        Alt havner ett sted, og bare ett.
      </h2>
      <p className={`${lead} mt-[3.2vh] max-w-[34ch]`} style={{ color: meta }}>
        Handler det om en person, ligger det under personen. Handler det om et
        selskap, under selskapet. Aldri to steder. Og sidene er vanlige
        tekstfiler — du kan åpne dem og lese dem selv.
      </p>
      <p className="mt-[3vh] max-w-[38ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty" style={{ color: rust }}>
        Over streken står det som gjelder nå, og det skrives om hver gang. Under
        streken står det som skjedde, og det endres aldri.
      </p>
    </Split>
  )
}

function Tilbake() {
  return (
    <Split figure={<DeckBrief className="h-[min(58vh,30rem)] w-full" />}>
      <p className={label} style={{ color: rust }}>Steg 4 · du får det igjen</p>
      <h2 className="mt-[2.4vh] max-w-[18ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">
        Og så får du alt sammen tilbake.
      </h2>
      <p className={`${lead} mt-[3.2vh] max-w-[34ch]`} style={{ color: meta }}>
        Hver morgen ligger det en oppsummering klar. Ikke alt — bare det som har
        endret seg, det du har lovet, og det du aldri hadde sett selv.
      </p>
      <p className="mt-[3vh] max-w-[38ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty" style={{ color: rust }}>
        Dette er grunnen til at vi orker å skrive inn i det hele tatt. Ingen
        skriver ned ting bare for arkivets skyld.
      </p>
    </Split>
  )
}

function Engangsarbeid() {
  return (
    <Statement
      eyebrow="Disiplinen"
      heading="Alt du gjør to ganger, skriver du ned."
      body="Første gangen er treg. Du forklarer, den bommer, du retter, du forklarer igjen. Men i det den endelig sitter, skriver du ned hvordan — og da er den jobben gjort for alltid."
      close="Måtte du be om det samme to ganger, gikk du glipp av noe. Det er sånn det blir tretten av dem: ikke ett stort prosjekt, men mange små ganger noen orket å skrive ned det de nettopp fant ut."
    />
  )
}

function Organisasjonen() {
  return (
    <Diagram
      mode="organisasjon"
      heading="Slik er kontoret satt opp i dag."
      aside="Menneskene · tretten agenter"
    />
  )
}

function Viktor() {
  return (
    <div className="grid h-full grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[5vw]">
      <div />
      <div className="flex h-full flex-col justify-center">
        <p className={label} style={{ color: meta }}>
          Midten av org-kartet
        </p>
        <h2 className="mt-[2.4vh] max-w-[27ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">
          Den gjør ikke arbeidet. Den finner ut hvem som skal.
        </h2>
        <Beats
          items={[
            ["Alltid på", "Tar imot alt vi skriver. Sender det videre."],
            ["Ved behov", "Henter inn spesialisten når presisjon koster noe."],
            ["Søndag", "Uken oppsummert: levert, ventende, stoppet."],
          ]}
          wide
        />
        <p
          className="mt-[3vh] max-w-[52ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty"
          style={{ color: rust }}
        >
          Dette laget var mellomledelse. Nå er det en tekstfil.
        </p>
      </div>
    </div>
  )
}

function AdvantiCmo() {
  return (
    <div className="grid h-full grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[5vw]">
      <div />
      <div className="flex h-full flex-col justify-center">
        <p className={label} style={{ color: meta }}>
          Én av spesialistene
        </p>
        <h2 className="mt-[2.4vh] max-w-[27ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">
          Den skriver alt vi legger ut.
        </h2>
        <Beats
          items={[
            ["Grunnlaget", "Den finner ikke på noe. Den bruker det som allerede ligger i databasen."],
            ["Hver uke", "Innlegg, nyhetsbrev, oppdateringer på det som er til salgs."],
            ["Alltid", "Et menneske leser gjennom før noe går ut."],
          ]}
          wide
        />
        <p
          className="mt-[3vh] max-w-[52ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty"
          style={{ color: rust }}
        >
          Den finner aldri på et tall. Alt den skriver, står allerede et sted.
        </p>
      </div>
    </div>
  )
}

function AdvantiSalg() {
  return (
    <div className="grid h-full grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[5vw]">
      <div />
      <div className="flex h-full flex-col justify-center">
        <p className={label} style={{ color: meta }}>
          Og én til
        </p>
        <h2 className="mt-[2.4vh] max-w-[27ch] font-serif text-[clamp(1.6rem,2.7vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em] text-pretty">
          Den leter etter treff hver eneste dag.
        </h2>
        <Beats
          items={[
            ["Hver morgen", "Går gjennom nye kjøpere mot alt vi har på selgersiden."],
            ["Finner den noe", "Legger den det på bordet, med begrunnelsen."],
            ["Så", "Er det vi som ringer."],
          ]}
          wide
        />
        <p
          className="mt-[3vh] max-w-[52ch] font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.35] text-pretty"
          style={{ color: rust }}
        >
          Den gjør ikke handelen. Den finner den. Det er to forskjellige jobber.
        </p>
      </div>
    </div>
  )
}

function Reglene() {
  return (
    <Statement
      eyebrow="Reglene"
      heading="Hjernen foreslår. Mennesket bestemmer."
      items={[
        ["Hjernen", "Kunnskap og påstander. Rikt, men ikke rent nok."],
        ["Disken", "Et menneske ser forslaget. Godkjenner, eller forkaster."],
        ["CRM-et", "Operativ sannhet. Ingenting inn uten et menneske."],
        ["Referatet", "Vi tar råteksten, aldri sammendraget. Sammendrag finner på enighet som aldri fant sted."],
      ]}
      wide
      close="Agenten skriver utkast. Jeg trykker send. Kunderelasjonen delegerer vi ikke."
    />
  )
}

function Feilene() {
  return (
    <Statement
      eyebrow="Ærlig talt"
      heading="En hjerne ingen luker blir en søppelfylling med god søkefunksjon."
      items={[
        ["Uke én", "Et leketøy. Du retter mer enn du sparer."],
        ["Uke to", "Her slutter de fleste."],
        ["Uke tolv", "Biblioteket svarer før du er ferdig med å spørre."],
      ]}
      wide
      close="Noen må fortsatt luke. Det er en jobb, ikke en innstilling."
    />
  )
}

function EnHylle() {
  return (
    <Statement
      eyebrow="Hvis du skal begynne"
      heading="Ingen bygger lageret først."
      items={[
        ["I dag", "Velg én ting du gjør hver uke og ikke liker."],
        ["I morgen", "Skriv ned hvordan du gjør den. På norsk, i en fil."],
        ["Neste uke", "La den gå av seg selv."],
      ]}
      wide
      close="Det blir ikke stort fordi noen planla det. Det blir stort fordi noen la til én hylle om gangen."
    />
  )
}

function Slutt() {
  return (
    <div className="flex h-full w-[min(58%,54rem)] flex-col justify-center">
      <p className={label} style={{ color: rust }}>
        Til slutt
      </p>
      <h2 className={`${display} mt-[3.5vh] max-w-[12ch]`}>
        Nå får jeg beskjed.
      </h2>
      <p className={`${lead} mt-[4.5vh] max-w-[44ch]`} style={{ color: meta }}>
        Det er alt jeg egentlig har prøvd å bygge. Ikke et system som passer på
        oss — et som husker det vi ikke rekker.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------- dekket */

const solid = (x: number, y: number, scale: number, opacity: number, rotation: number) => ({
  x,
  y,
  scale,
  opacity,
  rotation,
})

const slides: Slide[] = [
  { id: "intro", label: "Intro", Content: Cover, figure: solid(6, 0, 1.18, 1, 286) },
  { id: "ommeg", label: "Kort om meg", Content: OmMeg, figure: solid(18, -19, 0.48, 0.42, 314) },
  { id: "tresteg", label: "Slik ser jeg AI", Content: TreSteg, figure: solid(16, -17, 0.54, 0.56, 342) },
  { id: "steg1", label: "Steg 01 · chat", Content: Steg1, figure: solid(46, -32, 0.38, 0.13, 370) },
  { id: "steg2", label: "Steg 02 · agenter", Content: Steg2, figure: solid(46, -32, 0.38, 0.13, 398) },
  { id: "steg3", label: "Steg 03 · generativ UI", Content: Steg3, figure: solid(46, -32, 0.38, 0.13, 426) },
  { id: "bransjen", label: "Utgangspunktet", Content: Bransjen, figure: solid(17, -18, 0.5, 0.5, 454) },
  { id: "grensa", label: "Grensa", Content: Grensa, figure: solid(19, -20, 0.44, 0.46, 482) },
  { id: "paanytt", label: "First principles", Content: FirstPrinciples, figure: solid(15, -16, 0.58, 0.6, 510) },
  { id: "snudd", label: "Resultatet", Content: Snudd, figure: solid(13, -13, 0.66, 0.68, 538) },
  {
    id: "loop",
    label: "Arbeidsløkka",
    Content: Loop,
    figure: solid(24, -24, 0.36, 0, 552),
  },
  { id: "braindump", label: "Steg 1 · du skriver", Content: Braindump, figure: solid(44, -30, 0.4, 0.16, 566) },
  { id: "connectorer", label: "Steg 2 · connectorer", Content: Connectorer, figure: solid(46, -32, 0.38, 0.14, 594) },
  { id: "lagrer", label: "Steg 3 · den lagrer", Content: Lagrer, figure: solid(46, -32, 0.38, 0.14, 622) },
  { id: "tilbake", label: "Steg 4 · du får det igjen", Content: Tilbake, figure: solid(46, -32, 0.38, 0.14, 650) },
  { id: "engangsarbeid", label: "Disiplinen", Content: Engangsarbeid, figure: solid(14, -14, 0.62, 0.64, 678) },
  {
    id: "organisasjon",
    label: "Organisasjonen",
    Content: Organisasjonen,
    figure: solid(24, -24, 0.36, 0, 692),
    node: chartFrame,
  },
  {
    id: "viktor",
    label: "Nærbilde · Viktor",
    Content: Viktor,
    enter: "slide-in-from-right-3 [animation-delay:240ms] [animation-fill-mode:backwards]",
    figure: solid(24, -24, 0.36, 0, 706),
    node: ceoCloseFrame,
    nodeLabel: { role: "chief of staff", name: "Viktor" },
  },
  {
    id: "cmo",
    label: "Nærbilde · Advanti CMO",
    Content: AdvantiCmo,
    enter: "slide-in-from-right-3 [animation-delay:240ms] [animation-fill-mode:backwards]",
    figure: solid(24, -24, 0.36, 0, 720),
    node: ceoCloseFrame,
    nodeLabel: { role: "marked", name: "Advanti CMO" },
  },
  {
    id: "salg",
    label: "Nærbilde · Advanti Salg",
    Content: AdvantiSalg,
    enter: "slide-in-from-right-3 [animation-delay:240ms] [animation-fill-mode:backwards]",
    figure: solid(24, -24, 0.36, 0, 734),
    node: ceoCloseFrame,
    nodeLabel: { role: "salg", name: "Advanti Salg" },
  },
  { id: "regler", label: "Reglene", Content: Reglene, figure: solid(18, -18, 0.5, 0.5, 762), node: hiddenClose },
  { id: "feil", label: "Ærlig talt", Content: Feilene, figure: solid(16, -16, 0.56, 0.56, 790) },
  { id: "tror", label: "Hva jeg tror", Content: HvaJegTror, figure: solid(20, -20, 0.42, 0.4, 818) },
  { id: "hylle", label: "Mandag morgen", Content: EnHylle, figure: solid(11, -10, 0.78, 0.8, 846) },
  { id: "slutt", label: "Slutt · spørsmål", Content: Slutt, figure: solid(8, 1, 1.24, 0.95, 874) },
]

export function AiITreStegDeck() {
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(slides.length - 1, next))),
    [],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.matches("button, a, input, select, textarea"))
      ) {
        return
      }

      if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
        event.preventDefault()
        setIndex((current) => Math.min(slides.length - 1, current + 1))
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault()
        setIndex((current) => Math.max(0, current - 1))
      }
      if (event.key === "Home") setIndex(0)
      if (event.key === "End") setIndex(slides.length - 1)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <main
      id="main"
      className="relative h-dvh min-h-[34rem] overflow-hidden [font-synthesis:none]"
      style={{ backgroundColor: paper.ground, color: ink }}
      aria-roledescription="lysbildefremvisning"
    >
      {/* Skallet står stille gjennom hele foredraget: topptekst, legeme, bunntekst,
          framdrift. Bare selve teksten byttes ut — så ingenting hopper. */}
      <header
        className={`absolute inset-x-[5.5vw] top-[4vh] z-10 flex items-baseline justify-between gap-8 ${label}`}
        style={{ color: meta }}
      >
        <p>Christer Hagen</p>
        <p className="tabular-nums">Kraft i Nord · 2026</p>
      </header>

      <TravellingSolid figure={slide.figure} />
      <MorphingNode frame={slide.node ?? hidden} nodeLabel={slide.nodeLabel} />

      <section
        key={slide.id}
        className={`absolute inset-0 z-[1] animate-in fade-in-0 duration-300 ease-out motion-reduce:animate-none ${
          slide.enter ?? "slide-in-from-bottom-2"
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="h-full px-[5.5vw] pt-[11vh] pb-[13vh]">
          <slide.Content />
        </div>
      </section>

      <button
        type="button"
        aria-label="Forrige lysbilde"
        onClick={() => go(index - 1)}
        disabled={index === 0}
        className="absolute inset-y-0 start-0 z-20 w-[14vw] cursor-w-resize outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 disabled:pointer-events-none disabled:opacity-0"
        style={{ outlineColor: rust }}
      />
      <button
        type="button"
        aria-label="Neste lysbilde"
        onClick={() => go(index + 1)}
        disabled={index === slides.length - 1}
        className="absolute inset-y-0 end-0 z-20 w-[26vw] cursor-e-resize outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 disabled:pointer-events-none disabled:opacity-0"
        style={{ outlineColor: rust }}
      />

      <footer
        className={`absolute inset-x-[5.5vw] bottom-[4.5vh] z-10 flex items-baseline justify-between gap-8 ${label}`}
      >
        <p style={{ color: rust }}>{slide.label}</p>
        <p className="tabular-nums" style={{ color: meta }}>
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
      </footer>

      {/* Framdrift: skalering, ikke bredde — holder animasjonen unna layout. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-[3px]"
        style={{ backgroundColor: rule }}
      >
        <div
          className="h-full origin-left transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            backgroundColor: rust,
            transform: `scaleX(${(index + 1) / slides.length})`,
          }}
        />
      </div>
    </main>
  )
}
