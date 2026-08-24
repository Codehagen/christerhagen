"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import savedStyle from "@/data/presentation-style.json"
import {
  renderPresentationStyle,
  type PresentationStyleConfig,
} from "@/lib/presentation-style"

const baseConfig = savedStyle as PresentationStyleConfig

const display =
  "text-[clamp(4rem,8.3vw,10rem)] leading-[0.88] font-semibold tracking-[-0.07em] text-balance"
const title =
  "text-[clamp(2.8rem,5.4vw,6.5rem)] leading-[0.94] font-semibold tracking-[-0.06em] text-balance"
const lead =
  "max-w-[38ch] text-[clamp(1.3rem,1.85vw,2.2rem)] leading-[1.28] font-normal tracking-[-0.025em] text-pretty"
const eyebrow =
  "text-[clamp(0.75rem,0.82vw,1rem)] leading-none font-semibold tracking-[0.14em] text-[#ff542d] uppercase"

function PlotterField({
  seed,
  side = "right",
  showTraces = true,
}: {
  seed: number
  side?: "right" | "full"
  showTraces?: boolean
}) {
  const scene = useMemo(
    () => renderPresentationStyle({ ...baseConfig, seed }),
    [seed],
  )
  const transform = side === "right" ? "translate(310 -6) scale(.84)" : "translate(0 18) scale(1 .9)"

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 960 540"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <defs>
        <pattern
          id={`grid-${seed}`}
          width={baseConfig.gridDensity}
          height={baseConfig.gridDensity}
          patternUnits="userSpaceOnUse"
          x={scene.gridOffset.x}
          y={scene.gridOffset.y}
        >
          <path
            d={`M ${baseConfig.gridDensity} 0 L 0 0 0 ${baseConfig.gridDensity}`}
            fill="none"
            stroke={scene.palette.grid}
            strokeWidth="0.55"
            opacity="0.24"
          />
        </pattern>
        <clipPath id={`clip-${seed}`}>
          <rect x={side === "right" ? 430 : 0} width={side === "right" ? 530 : 960} height="540" />
        </clipPath>
      </defs>

      <rect width="960" height="540" fill={scene.palette.background} />
      <rect width="960" height="540" fill={`url(#grid-${seed})`} />

      <g
        clipPath={`url(#clip-${seed})`}
        transform={transform}
        opacity={showTraces ? 1 : 0}
      >
        {scene.traces.map((trace, index) => (
          <g key={trace.id}>
            <path
              d={trace.d}
              fill="none"
              stroke={scene.palette.foreground}
              strokeWidth={baseConfig.lineWeight}
              strokeLinejoin="miter"
              opacity={0.42 + index * 0.15}
            />
            <path
              d={trace.d}
              fill="none"
              stroke={scene.palette.accent}
              strokeWidth="0.55"
              strokeDasharray="2 9"
              opacity="0.82"
              transform={`translate(0 ${3 + index * 2})`}
            />
          </g>
        ))}
      </g>

      {scene.grain.map((dot, index) => (
        <circle
          key={index}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={scene.palette.foreground}
          opacity={dot.opacity * 0.55}
        />
      ))}

      <g stroke={scene.palette.foreground} strokeWidth="0.8" opacity="0.65">
        <path d="M62 62h18M71 53v18" />
        <path d="M880 62h18M889 53v18" />
        <path d="M880 462h18M889 453v18" />
      </g>
      <rect x="934" width="26" height="540" fill={scene.palette.accent} />
    </svg>
  )
}

function SlideContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden text-[#171717]">
      <div className="h-full px-[5vw] py-[5vh]">{children}</div>
    </div>
  )
}

function Cover() {
  return (
    <SlideContent>
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-8 text-[clamp(0.75rem,0.82vw,1rem)] leading-none font-semibold tracking-[0.12em] uppercase">
          <p>Christer Hagen</p>
          <p className="text-end tabular-nums">Kraft i Nord · 2026</p>
        </header>
        <div className="mt-[15vh]">
          <p className={eyebrow}>Kunstig intelligens · tre nivåer</p>
          <h1 className={`${display} mt-[3.5vh] max-w-[12ch]`}>
            <span className="block">Fra å spørre</span>
            <span className="block">til å delegere.</span>
          </h1>
        </div>
        <div className="mt-auto flex items-end justify-between gap-10 border-t border-[#ff542d]/55 pt-[2.5vh]">
          <p className={`${lead} max-w-[34ch]`}>
            Tre nivåer i AI — og hva vi har lært av å bygge Advanti Estate.
          </p>
          <p className="shrink-0 text-[clamp(0.75rem,0.82vw,1rem)] leading-none font-semibold tracking-[0.12em] text-[#ff542d] uppercase">
            Intro · 01
          </p>
        </div>
      </div>
    </SlideContent>
  )
}

const levels = [
  { number: "01", name: "Chat", text: "Du spør. AI svarer." },
  { number: "02", name: "Agentic AI", text: "Du delegerer. AI utfører." },
  { number: "03", name: "Generativ UI", text: "Dataene bygger visningen." },
]

function Levels() {
  return (
    <SlideContent>
      <div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)] gap-[6vw]">
        <div className="flex flex-col justify-center">
          <p className={eyebrow}>Modell 01—03</p>
          <h2 className={`${title} mt-[3vh] max-w-[9ch]`}>Tre nivåer. Samme retning.</h2>
          <p className={`${lead} mt-[4vh] max-w-[25ch]`}>
            Verdien øker når AI går fra språk til handling — og til slutt bygger selve arbeidsflaten.
          </p>
        </div>
        <ol className="m-0 flex list-none flex-col justify-center p-0">
          {levels.map((level) => (
            <li
              key={level.number}
              className="grid grid-cols-[4.5rem_1fr] items-baseline gap-6 border-t border-[#171717]/25 py-[clamp(1.2rem,2.3vh,2.2rem)] last:border-b"
            >
              <span className="text-[clamp(1.1rem,1.4vw,1.7rem)] leading-none font-semibold text-[#ff542d] tabular-nums">
                {level.number}
              </span>
              <div>
                <h3 className="text-[clamp(1.75rem,2.8vw,3.4rem)] leading-none font-semibold tracking-[-0.05em]">
                  {level.name}
                </h3>
                <p className="mt-3 text-[clamp(1.1rem,1.45vw,1.75rem)] leading-[1.3] text-[#4f4d48]">
                  {level.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SlideContent>
  )
}

function Agentic() {
  const steps = [
    ["01", "Oppgave", "Lag oppdragsavtalen"],
    ["02", "Agent", "Henter data og bygger dokumentet"],
    ["03", "Resultat", "Ferdig i riktig mappe"],
  ]

  return (
    <SlideContent>
      <div className="flex h-full flex-col">
        <div className="mt-[7vh]">
          <p className={eyebrow}>Nivå 2 · agentic AI</p>
          <h2 className={`${title} mt-[3vh] max-w-[13ch]`}>AI svarer ikke. Den utfører.</h2>
          <p className={`${lead} mt-[4vh] max-w-[32ch]`}>
            Du går fra å formulere spørsmål til å delegere arbeid som faktisk blir gjort.
          </p>
        </div>
        <ol className="relative z-10 mt-auto grid list-none grid-cols-3 gap-[4vw] border-t border-[#171717]/40 p-0 pt-[3vh]">
          {steps.map(([number, name, text]) => (
            <li key={number} className="min-w-0">
              <p className="text-[clamp(0.8rem,0.9vw,1.1rem)] leading-none font-semibold tracking-[0.1em] text-[#ff542d] tabular-nums uppercase">
                {number} · {name}
              </p>
              <p className="mt-4 max-w-[23ch] text-[clamp(1.15rem,1.55vw,1.85rem)] leading-[1.25] text-pretty">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </SlideContent>
  )
}

function Advanti() {
  const work = [
    "Analyser fra eiendomsdata",
    "Oppdragsavtaler fra CRM",
    "Datarom som følger kjøperne",
    "Presentasjoner per case",
  ]

  return (
    <SlideContent>
      <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(28rem,0.9fr)] gap-[7vw]">
        <div className="flex flex-col justify-center">
          <p className={eyebrow}>Advanti Estate · i praksis</p>
          <h2 className={`${title} mt-[3vh] max-w-[11ch]`}>Vi er allerede på steg 2.</h2>
          <p className={`${lead} mt-[4vh] max-w-[31ch]`}>
            CRM-et er ikke bare et arkiv. Dataene setter agentene i stand til å levere arbeidet.
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <p className="mb-[3vh] text-[clamp(0.8rem,0.9vw,1.1rem)] leading-none font-semibold tracking-[0.12em] uppercase">
            Én dataryggrad → fire leveranser
          </p>
          <ul className="m-0 grid list-none gap-0 border-s border-[#ff542d] p-0 ps-[3vw]">
            {work.map((item, index) => (
              <li
                key={item}
                className="relative border-t border-[#171717]/25 py-[clamp(1.25rem,2.2vh,2.1rem)] first:border-t-0"
              >
                <span aria-hidden className="absolute top-1/2 -start-[3vw] w-[2.2vw] border-t border-[#ff542d]" />
                <span className="text-[clamp(1.2rem,1.7vw,2.05rem)] leading-[1.15] font-semibold tracking-[-0.035em]">
                  <span className="me-5 text-[#ff542d] tabular-nums">0{index + 1}</span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideContent>
  )
}

const slides = [Cover, Levels, Agentic, Advanti]

export function AiITreStegDeck() {
  const [index, setIndex] = useState(0)
  const ActiveSlide = slides[index]
  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(slides.length - 1, next))),
    [],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
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
      className="relative h-dvh min-h-[34rem] overflow-hidden bg-[#f8f8f4] [font-synthesis:none]"
      aria-roledescription="lysbildefremvisning"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <PlotterField seed={260824} side="right" showTraces={index !== 0} />
      </div>

      <section className="absolute inset-0" aria-live="polite" aria-atomic="true">
        <ActiveSlide />
      </section>

      <button
        type="button"
        aria-label="Forrige lysbilde"
        onClick={() => go(index - 1)}
        disabled={index === 0}
        className="absolute inset-y-0 start-0 z-20 w-[14vw] cursor-w-resize disabled:pointer-events-none disabled:opacity-0"
      />
      <button
        type="button"
        aria-label="Neste lysbilde"
        onClick={() => go(index + 1)}
        disabled={index === slides.length - 1}
        className="absolute inset-y-0 end-0 z-20 w-[28vw] cursor-e-resize disabled:pointer-events-none disabled:opacity-0"
      />

      <div className="absolute inset-x-[5vw] bottom-[2.2vh] z-30 flex items-center justify-end gap-5 text-[clamp(0.75rem,0.78vw,0.95rem)] leading-none font-semibold tracking-[0.1em] text-[#171717] tabular-nums">
        <span aria-hidden>← →</span>
        <span>{String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </main>
  )
}
