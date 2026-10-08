"use client"

// de animerte figurene fra det gamle dekket, delt av alle layoutene.
// Fargene kommer fra --deck-ink / --deck-rust / --deck-ground på layouten.

import { useEffect, useRef, useState } from "react"

import { DeckAgentFile } from "@/components/deck-agent-file"
import { DeckBrief } from "@/components/deck-brief"
import { DeckConnectors } from "@/components/deck-connectors"
import { DeckGate } from "@/components/deck-gate"
import { DeckPage } from "@/components/deck-page"
import { StepAgent, StepChat, StepUI } from "@/components/deck-steps"
import { DeckUtkast } from "@/components/deck-utkast"

import { contributionWeekStarts, contributionWeeks } from "./github"

const figures = {
  chat: StepChat,
  agent: StepAgent,
  agentfil: DeckAgentFile,
  ui: StepUI,
  connectors: DeckConnectors,
  page: DeckPage,
  brief: DeckBrief,
  gate: DeckGate,
  utkast: DeckUtkast,
}

export function StepFigure({ name, className }: { name: keyof typeof figures; className?: string }) {
  const Figure = figures[name]
  return <Figure className={className} />
}

/**
 * Samme skrivemaskin som i det gamle dekket: pausene ligger på skilletegnene,
 * så det er samme forestilling hver gang.
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
    const step = (index: number) => {
      setCount(index)
      if (index >= text.length) return
      const previous = text[index - 1]
      const pause =
        previous === "." ? speed * 10 : previous === "," ? speed * 5 : previous === " " ? speed * 2.2 : speed
      timer = window.setTimeout(() => step(index + 1), pause)
    }
    timer = window.setTimeout(() => step(0), delay)
    return () => window.clearTimeout(timer)
  }, [text, speed, delay])

  return { count, done: count >= text.length }
}

export function Braindump({
  note,
  result,
  colors,
}: {
  note: string
  result: Array<[string, string]>
  colors: { ink: string; rust: string; meta: string; rule: string }
}) {
  const { count, done } = useTypewriter(note, 18, 420)
  const label = "font-mono uppercase tracking-[0.14em] text-[clamp(0.62rem,0.72vw,0.88rem)] leading-none"

  return (
    <div className="flex w-full max-w-[40rem] flex-col justify-center">
      <p className={`${label} flex items-baseline justify-between gap-6`} style={{ color: colors.meta }}>
        <span>Det jeg skrev</span>
        <span className="tabular-nums">21:14</span>
      </p>

      {/* Hele teksten står der fra start; bokstavene slås på. Da hopper ingen ord ned en linje. */}
      <p aria-hidden="true" className="mt-[2.2vh] font-mono text-[clamp(0.8rem,1.02vw,1.22rem)] leading-[1.62] text-pretty" style={{ color: colors.ink }}>
        <span>{note.slice(0, count)}</span>
        <span style={{ backgroundColor: colors.rust, color: "transparent" }}>{note.slice(count, count + 1)}</span>
        <span className="opacity-0">{note.slice(count + 1)}</span>
      </p>
      <span className="sr-only">{note}</span>

      <div className="mt-[3.2vh] border-t pt-[2vh]" style={{ borderColor: colors.rule }}>
        <p
          className={`${label} transition-opacity duration-300 ease-out motion-reduce:transition-none`}
          style={{ color: colors.rust, opacity: done ? 1 : 0 }}
        >
          Det som skjedde
        </p>
        <ol className="m-0 mt-[1.4vh] grid list-none p-0">
          {result.map(([key, text], position) => (
            <li
              key={key}
              className="grid grid-cols-[8.5rem_1fr] items-baseline gap-x-[1.6vw] border-t py-[clamp(0.5rem,1vh,1rem)] transition-[opacity,transform] duration-300 ease-out last:border-b motion-reduce:transition-none"
              style={{
                borderColor: colors.rule,
                opacity: done ? 1 : 0,
                transform: done ? "none" : "translateY(6px)",
                transitionDelay: done ? `${140 + position * 320}ms` : "0ms",
              }}
            >
              <span className={label} style={{ color: colors.rust }}>{key}</span>
              <span className="font-serif text-[clamp(0.95rem,1.25vw,1.5rem)] leading-[1.3] text-pretty" style={{ color: colors.ink }}>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/**
 * Videoen står stille på plakatbildet til du klikker. Klikket starter den fra
 * begynnelsen, med lyd, i fullskjerm — det er salen som skal se den, ikke en
 * miniatyr i hjørnet. Esc går tilbake til lysbildet og pauser.
 */
export function VideoClip({
  src,
  poster,
  colors,
  className,
}: {
  src: string
  poster: string
  colors: { ink: string; rust: string; meta: string; rule: string }
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [full, setFull] = useState(false)

  useEffect(() => {
    const onChange = () => {
      const video = ref.current
      const isFull = document.fullscreenElement === video
      setFull(isFull)
      if (!isFull) video?.pause()
    }
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const start = async () => {
    const video = ref.current
    if (!video) return
    if (video.ended || video.currentTime > 0) video.currentTime = 0
    video.muted = false
    try {
      await video.requestFullscreen()
    } catch {
      // Fullskjerm kan være sperret (iframe, eldre nettleser) — da spiller den på lysbildet.
    }
    void video.play()
  }

  return (
    <figure className={`m-0 ${className ?? ""}`}>
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur()
          void start()
        }}
        aria-label="Spill av videoen i fullskjerm"
        className="group relative block w-full cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ outlineColor: colors.ink }}
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          controls={full}
          playsInline
          preload="auto"
          onEnded={() => {
            if (document.fullscreenElement) void document.exitFullscreen()
          }}
          className="block max-h-[62vh] w-full border object-contain"
          style={{ borderColor: colors.rule, background: "black" }}
        />
        <span
          className="absolute inset-0 grid place-items-center"
          aria-hidden="true"
        >
          <span
            className="grid size-[clamp(3.5rem,6vw,6rem)] place-items-center rounded-full transition-transform duration-150 ease-out group-active:scale-[0.96]"
            style={{ background: "rgb(0 0 0 / 0.62)", boxShadow: `inset 0 0 0 1px ${colors.rule}` }}
          >
            <svg viewBox="0 0 24 24" className="ml-[8%] size-[38%]" fill={colors.ink}>
              <path d="M7 4.5v15l12.5-7.5z" />
            </svg>
          </span>
        </span>
        <span
          className="absolute right-[1vw] bottom-[1.4vh] font-mono text-[clamp(0.66rem,0.78vw,0.94rem)] uppercase tracking-[0.12em]"
          style={{ color: colors.ink, background: "rgb(0 0 0 / 0.6)", padding: "0.5em 0.8em" }}
        >
          Klikk for å spille · Esc for å gå tilbake
        </span>
      </button>
    </figure>
  )
}

/**
 * Innholdslista som en profil: rutenettet salen kjenner fra telefonen sin, men
 * rutene er tekst i dekkets egne farger. Utkastene er det agenten har satt opp
 * og som ingen har godkjent ennå.
 */
export function Feed({
  handle,
  posts,
  colors,
}: {
  handle: string
  posts: Array<{ kicker: string; title: string; source: string; status: "Ute" | "Utkast" }>
  colors: { ink: string; rust: string; meta: string; rule: string; ground: string; tile: string }
}) {
  const live = posts.filter((p) => p.status === "Ute").length
  return (
    <div className="mx-auto w-full max-w-[34rem] border" style={{ borderColor: colors.rule, background: colors.ground }}>
      <div className="flex items-center gap-[1.2vw] border-b px-[1.2vw] py-[1.6vh]" style={{ borderColor: colors.rule }}>
        <span
          aria-hidden="true"
          className="grid size-[clamp(2.4rem,3.4vw,3.6rem)] shrink-0 place-items-center rounded-full font-serif text-[clamp(1rem,1.4vw,1.6rem)] font-semibold"
          style={{ boxShadow: `inset 0 0 0 1px ${colors.rule}`, color: colors.ink }}
        >
          A
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[clamp(0.78rem,0.92vw,1.1rem)]" style={{ color: colors.ink }}>{handle}</p>
          <p className="mt-[0.5vh] font-mono text-[clamp(0.66rem,0.76vw,0.92rem)]" style={{ color: colors.meta }}>
            {live} publisert · {posts.length - live} venter på deg
          </p>
        </div>
      </div>
      <ol className="m-0 grid list-none grid-cols-3 gap-px p-0" style={{ background: colors.rule }}>
        {posts.map((post) => {
          const draft = post.status === "Utkast"
          return (
            <li key={post.title} className="relative flex aspect-square flex-col justify-between p-[0.9vw]" style={{ background: colors.tile }}>
              <p className="font-mono text-[clamp(0.56rem,0.64vw,0.78rem)] uppercase tracking-[0.12em]" style={{ color: colors.rust }}>
                {post.kicker}
              </p>
              <p className="font-serif text-[clamp(0.78rem,0.98vw,1.18rem)] leading-[1.18] font-semibold text-pretty" style={{ color: colors.ink, opacity: draft ? 0.62 : 1 }}>
                {post.title}
              </p>
              <p className="font-mono text-[clamp(0.52rem,0.6vw,0.72rem)] leading-[1.3]" style={{ color: colors.meta }}>
                {draft ? "Utkast · " : ""}{post.source}
              </p>
              {draft ? (
                <span aria-hidden="true" className="pointer-events-none absolute inset-[0.45vw] border border-dashed" style={{ borderColor: colors.rust }} />
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const months = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]

/**
 * Bidragskalenderen fra GitHub, i dekkets rust i stedet for GitHub-grønt. Fire
 * trinn etter antall bidrag; tomme dager er bare en hårfin ramme. Måneder over,
 * ukedager til venstre, slik at salen kjenner den igjen fra profilen.
 */
export function Contributions({ colors }: { colors: { rust: string; rule: string; meta: string } }) {
  const level = (n: number) => (n <= 0 ? 0 : n <= 10 ? 0.28 : n <= 25 ? 0.5 : n <= 60 ? 0.75 : 1)
  const cols = { gridTemplateColumns: `repeat(${contributionWeeks.length}, minmax(0,1fr))` }
  const small = "font-mono text-[clamp(0.56rem,0.66vw,0.8rem)] leading-none"
  const monthAt = contributionWeekStarts.map((start, i) => {
    const m = Number(start.slice(5, 7)) - 1
    const prev = i ? Number(contributionWeekStarts[i - 1].slice(5, 7)) - 1 : -1
    return m !== prev && i < contributionWeekStarts.length - 2 ? months[m] : ""
  })
  return (
    <div
      role="img"
      aria-label="GitHub-bidrag siste år: over 9 000 bidrag fordelt på 362 av 369 dager"
      className="grid w-full grid-cols-[auto_1fr] gap-x-[0.6vw]"
    >
      <span />
      <div className="mb-[0.8vh] grid gap-[0.18vw]" style={{ ...cols, color: colors.meta }}>
        {monthAt.map((m, i) => (
          <span key={i} className={`${small} whitespace-nowrap`}>{m}</span>
        ))}
      </div>
      <div className="grid grid-rows-7 gap-[0.18vw]" style={{ color: colors.meta }}>
        {["", "man", "", "ons", "", "fre", ""].map((d, i) => (
          <span key={i} className={`${small} flex items-center`}>{d}</span>
        ))}
      </div>
      <div className="grid gap-[0.18vw]" style={cols}>
        {contributionWeeks.map((week, w) => (
          <div key={w} className="grid gap-[0.18vw]">
            {week.map((n, d) => (
              <span
                key={d}
                className="block aspect-square rounded-[2px]"
                style={
                  n < 0
                    ? { visibility: "hidden" }
                    : n === 0
                      ? { boxShadow: `inset 0 0 0 1px ${colors.rule}` }
                      : { background: colors.rust, opacity: level(n) }
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Profilkolonnen: samme rekkefølge som på GitHub, med portrettet fra nettsiden. */
export function Profile({
  colors,
  companies,
}: {
  colors: { ink: string; meta: string; body: string; rule: string; rust: string }
  companies: Array<[string, string]>
}) {
  return (
    <div>
      {/* Portrettet er helfigur; skalert inn mot ansiktet blir det en avatar. */}
      <div
        className="relative aspect-square w-[min(14vw,14rem)] overflow-hidden rounded-full"
        style={{ boxShadow: `0 0 0 1px ${colors.rule}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- beskjæringen er en transform på selve bildet */}
        <img
          src="/images/christer-hagen-portrait.jpg"
          alt="Christer Hagen"
          className="absolute max-w-none grayscale"
          // Ansiktet står på 59 % / 38 % av bildet. 210 % bredde, flyttet så det havner midt i sirkelen.
          style={{ width: "210%", left: "-74%", top: "-69%" }}
        />
      </div>
      <p className="mt-[2.4vh] font-serif text-[clamp(1.4rem,2vw,2.4rem)] leading-none font-semibold" style={{ color: colors.ink }}>
        Christer
      </p>
      <p className="mt-[0.8vh] font-serif text-[clamp(1.1rem,1.5vw,1.8rem)] leading-none" style={{ color: colors.meta }}>
        Codehagen
      </p>
      <p className="mt-[2vh] max-w-[min(16vw,16rem)] font-serif text-[clamp(0.95rem,1.15vw,1.4rem)] leading-[1.4] text-pretty" style={{ color: colors.body }}>
        Har startet flere selskaper enn jeg tør å telle. Bodø.
      </p>
      {/* Som organisasjonene på en GitHub-profil: gruppert, kort, ingen logoer. */}
      <dl className="m-0 mt-[2.6vh] grid max-w-[min(17vw,17rem)] gap-[1.5vh] border-t pt-[2.2vh]" style={{ borderColor: colors.rule }}>
        {companies.map(([group, names]) => (
          <div key={group}>
            <dt className="font-mono text-[clamp(0.6rem,0.7vw,0.84rem)] uppercase tracking-[0.14em]" style={{ color: colors.rust }}>
              {group}
            </dt>
            <dd className="m-0 mt-[0.6vh] font-serif text-[clamp(0.84rem,1vw,1.2rem)] leading-[1.35] text-pretty" style={{ color: colors.body }}>
              {names}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
