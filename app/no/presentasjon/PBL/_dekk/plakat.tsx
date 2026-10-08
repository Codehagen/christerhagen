"use client"

// Plakat: én idé per flate. Enorm type øverst, detaljene i et bånd
// nederst. Hvert kapittel har sin egen farge, så salen ser hvor i fortellingen de er.

import { DemoLink, pad, type StageProps } from "./engine"
import type { Chapter, Slide, Track } from "./content"
import { Braindump, Contributions, Feed, StepFigure, VideoClip } from "./figure"

const paper = "#f5f2ea"
const ink = "#211e18"
const rust = "oklch(0.52 0.12 44)"

const theme: Record<Chapter, { bg: string; fg: string; accent: string; soft: string; rule: string }> = {
  Intro: { bg: paper, fg: ink, accent: rust, soft: "#5f594c", rule: "rgb(33 30 24 / 0.2)" },
  AI: { bg: ink, fg: paper, accent: "oklch(0.7 0.12 48)", soft: "#b4ac9b", rule: "rgb(245 242 234 / 0.22)" },
  Docdir: { bg: rust, fg: paper, accent: ink, soft: "#f3dccf", rule: "rgb(245 242 234 / 0.35)" },
  Advanti: { bg: paper, fg: ink, accent: rust, soft: "#5f594c", rule: "rgb(33 30 24 / 0.2)" },
  Tunnel: { bg: ink, fg: paper, accent: "oklch(0.7 0.12 48)", soft: "#b4ac9b", rule: "rgb(245 242 234 / 0.22)" },
  Verid: { bg: rust, fg: paper, accent: ink, soft: "#f3dccf", rule: "rgb(245 242 234 / 0.35)" },
  Fremover: { bg: paper, fg: ink, accent: rust, soft: "#5f594c", rule: "rgb(33 30 24 / 0.2)" },
}

const mono = "font-mono uppercase tracking-[0.16em] text-[clamp(0.64rem,0.74vw,0.9rem)] leading-none"
const giant = "font-serif font-semibold tracking-[-0.04em] text-balance leading-[0.88]"
const small = "font-serif text-[clamp(0.95rem,1.18vw,1.42rem)] leading-[1.36] text-pretty"

type T = (typeof theme)[Chapter]

function Chip({ track, t }: { track?: Track; t: T }) {
  if (!track) return null
  return (
    <span className={`${mono} inline-block px-[0.8em] py-[0.55em]`} style={{ background: t.accent, color: t.bg }}>
      {track}
    </span>
  )
}

/** Detaljbåndet nederst: like kolonner med hårfin linje over. */
function Band({ cols, t, children }: { cols: number; t: T; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-[2.4vw] border-t pt-[2.2vh]" style={{ borderColor: t.rule, gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {children}
    </div>
  )
}

function Cell({ k, v, t, kBig = false }: { k: string; v: string; t: T; kBig?: boolean }) {
  return (
    <div>
      <p
        className={kBig ? "font-serif text-[clamp(2.2rem,4.4vw,5.4rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums" : `${mono} tabular-nums`}
        style={{ color: t.accent }}
      >
        {k}
      </p>
      <p className={`${small} mt-[1.4vh]`} style={{ color: t.fg }}>{v}</p>
    </div>
  )
}

function Title({ slide, t, size = "clamp(3rem,7.4vw,9rem)" }: { slide: Slide; t: T; size?: string }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <p className={mono} style={{ color: t.accent }}>{slide.eyebrow}</p>
        <Chip track={slide.track} t={t} />
      </div>
      <h2 className={`${giant} mt-[2.4vh] max-w-[16ch]`} style={{ fontSize: size }}>{slide.title}</h2>
    </div>
  )
}

function Lead({ children, t }: { children?: string; t: T }) {
  if (!children) return null
  return <p className={`${small} mt-[2.6vh] max-w-[58ch]`} style={{ color: t.soft }}>{children}</p>
}

function Body({ slide, t }: { slide: Slide; t: T }) {
  const layout = "flex h-full flex-col justify-between gap-[3vh]"
  switch (slide.kind) {
    case "cover":
      return (
        <div className={layout}>
          <p className={mono} style={{ color: t.accent }}>{slide.eyebrow}</p>
          <h1 className={`${giant} max-w-[12ch]`} style={{ fontSize: "clamp(4rem,10.4vw,13rem)" }}>{slide.title}</h1>
          <Band cols={3} t={t}>
            <p className={`${small} col-span-2`} style={{ color: t.soft }}>{slide.lead}</p>
          </Band>
        </div>
      )
    case "end":
      return (
        <div className={layout}>
          <p className={mono} style={{ color: t.accent }}>{slide.eyebrow}</p>
          <h2 className={giant} style={{ fontSize: "clamp(5rem,16vw,20rem)" }}>{slide.title}</h2>
          <Band cols={3} t={t}>
            <p className={`${mono} tabular-nums`} style={{ color: t.soft }}>{slide.lead}</p>
          </Band>
        </div>
      )
    case "statement":
      return (
        <div className={layout}>
          <div>
            <Title slide={slide} t={t} />
            <Lead t={t}>{slide.body}</Lead>
          </div>
          <div>
            {slide.items ? (
              <Band cols={slide.items.length} t={t}>
                {slide.items.map(([k, v], i) => <Cell key={i} k={k} v={v} t={t} />)}
              </Band>
            ) : null}
            {slide.close ? <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p> : null}
          </div>
        </div>
      )
    case "steps":
      return (
        <div className={layout}>
          <Title slide={slide} t={t} />
          <div>
            <Band cols={slide.steps.length} t={t}>
              {slide.steps.map((s) => (
                <div key={s.n}>
                  <p className="font-serif text-[clamp(2.4rem,4.6vw,5.6rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums" style={{ color: t.accent }}>{s.n}</p>
                  <p className="mt-[1.8vh] font-serif text-[clamp(1.1rem,1.6vw,1.9rem)] leading-[1.1] font-semibold">{s.title}</p>
                  <p className={`${small} mt-[1vh]`} style={{ color: t.soft }}>{s.text}</p>
                </div>
              ))}
            </Band>
            {slide.close ? <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p> : null}
          </div>
        </div>
      )
    case "agents":
      return (
        <div className={layout}>
          <Title slide={slide} t={t} size="clamp(2.6rem,5.6vw,6.8rem)" />
          <div>
            <div className="grid grid-cols-4 gap-x-[2vw] gap-y-[2.6vh] border-t pt-[2.2vh]" style={{ borderColor: t.rule }}>
              {slide.agents.map((a) => (
                <div key={a.name}>
                  <p className={mono} style={{ color: t.accent }}>{a.mode}</p>
                  <p className="mt-[1.2vh] font-serif text-[clamp(1.1rem,1.6vw,1.9rem)] leading-[1.05] font-semibold">{a.name}</p>
                  <p className="mt-[0.8vh] font-serif text-[clamp(0.86rem,1vw,1.22rem)] leading-[1.35] text-pretty" style={{ color: t.soft }}>{a.does}</p>
                </div>
              ))}
              <p className={`${small} self-end`} style={{ color: t.accent }}>{slide.close}</p>
            </div>
          </div>
        </div>
      )
    case "timeline":
      return (
        <div className={layout}>
          <div>
            <Title slide={slide} t={t} />
            <Lead t={t}>{slide.body}</Lead>
          </div>
          <div>
            <Band cols={slide.events.length} t={t}>
              {slide.events.map(([k, v], i) => <Cell key={i} k={k} v={v} t={t} kBig={/\d/.test(k)} />)}
            </Band>
            {slide.close ? <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p> : null}
          </div>
        </div>
      )
    case "stats":
      return (
        <div className={layout}>
          <div>
            <Title slide={slide} t={t} />
            <Lead t={t}>{slide.body}</Lead>
          </div>
          <div>
            <Band cols={slide.stats.length} t={t}>
              {slide.stats.map(([k, v]) => <Cell key={k} k={k} v={v} t={t} kBig />)}
            </Band>
            {slide.close ? <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p> : null}
          </div>
        </div>
      )
    case "code":
      return (
        <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[4vw]">
          <div className={layout}>
            <Title slide={slide} t={t} size="clamp(2.8rem,6vw,7.4rem)" />
            <div>
              <p className={small} style={{ color: t.soft }}>{slide.body}</p>
              <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p>
            </div>
          </div>
          <pre className="m-0 self-center px-[2vw] py-[3vh] font-mono text-[clamp(0.74rem,1vw,1.2rem)] leading-[1.6]" style={{ background: ink, color: paper }}>
            {slide.code}
          </pre>
        </div>
      )
    case "demo":
      return (
        <div className={layout}>
          <div>
            <Title slide={slide} t={t} />
            <Lead t={t}>{slide.body}</Lead>
          </div>
          <Band cols={Math.max(2, slide.links.length)} t={t}>
            {slide.links.map((l) => (
              <DemoLink key={l.href} href={l.href} className="group block outline-none focus-visible:outline-2 focus-visible:outline-offset-4">
                <p className={mono} style={{ color: t.accent }}>{l.note} ↗</p>
                <p className="mt-[1.4vh] font-serif text-[clamp(1.6rem,3vw,3.6rem)] leading-none font-semibold tracking-[-0.03em] underline decoration-2 underline-offset-[0.14em] group-hover:decoration-[3px]">
                  {l.label}
                </p>
              </DemoLink>
            ))}
          </Band>
        </div>
      )
    case "braindump":
      return (
        <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[4vw]">
          <div className={layout}>
            <Title slide={slide} t={t} size="clamp(2.6rem,5.4vw,6.6rem)" />
            <div>
              <p className={small} style={{ color: t.soft }}>{slide.body}</p>
              <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p>
            </div>
          </div>
          <div className="self-center">
            <Braindump note={slide.note} result={slide.result} colors={{ ink: t.fg, rust: t.accent, meta: t.soft, rule: t.rule }} />
          </div>
        </div>
      )
    case "video":
      return (
        <div className="grid h-full grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-[4vw]">
          <div className={layout}>
            <Title slide={slide} t={t} size="clamp(2.4rem,4.6vw,5.6rem)" />
            <div>
              <p className={small} style={{ color: t.soft }}>{slide.body}</p>
              <p className={`${small} mt-[2.4vh]`}>
                <DemoLink href={slide.href} className="underline" style={{ color: t.accent }}>{slide.credit} ↗</DemoLink>
              </p>
            </div>
          </div>
          <VideoClip className="self-center" src={slide.src} poster={slide.poster} colors={{ ink: t.fg, rust: t.accent, meta: t.soft, rule: t.rule }} />
        </div>
      )
    case "feed":
      return (
        <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[4vw]">
          <div className={layout}>
            <Title slide={slide} t={t} size="clamp(2.6rem,5.4vw,6.6rem)" />
            <div>
              <p className={small} style={{ color: t.soft }}>{slide.body}</p>
              <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p>
            </div>
          </div>
          <div className="self-center">
            <Feed handle={slide.handle} posts={slide.posts} colors={{ ink: t.fg, rust: t.accent, meta: t.soft, rule: t.rule, ground: t.bg, tile: t.bg }} />
          </div>
        </div>
      )
    case "github":
      return (
        <div className={layout}>
          <Title slide={slide} t={t} size="clamp(2.4rem,5vw,6rem)" />
          <div>
            <Contributions colors={{ rust: t.accent, rule: t.rule, meta: t.soft }} />
            <p className={`${mono} mt-[1.4vh] normal-case`} style={{ color: t.soft }}>{slide.caption}</p>
          </div>
          <Band cols={3} t={t}>
            {slide.who.map(([track, line, joke]) => (
              <div key={track}>
                <Chip track={track} t={t} />
                <p className="mt-[1.4vh] font-serif text-[clamp(1.05rem,1.5vw,1.8rem)] leading-[1.15] font-semibold">{line}</p>
                <p className={`${small} mt-[0.8vh]`} style={{ color: t.soft }}>{joke}</p>
              </div>
            ))}
          </Band>
        </div>
      )
    case "figure":
      return (
        <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[4vw]">
          <div className={layout}>
            <Title slide={slide} t={t} size="clamp(2.8rem,6vw,7.4rem)" />
            <div>
              <p className={small} style={{ color: t.soft }}>{slide.body}</p>
              <p className={`${small} mt-[2.4vh]`} style={{ color: t.accent }}>{slide.close}</p>
            </div>
          </div>
          <StepFigure name={slide.figure} className="h-full max-h-[64vh] w-full self-center" />
        </div>
      )
    case "tracks":
      return (
        <div className={layout}>
          <Title slide={slide} t={t} />
          <Band cols={3} t={t}>
            {slide.tracks.map(([k, v]) => (
              <div key={k}>
                <Chip track={k} t={t} />
                <p className="mt-[1.8vh] font-serif text-[clamp(1.1rem,1.6vw,1.95rem)] leading-[1.18] font-semibold text-pretty">{v}</p>
              </div>
            ))}
          </Band>
        </div>
      )
  }
}

export function PlakatStage({ slide, index, total }: StageProps) {
  const t = theme[slide.chapter]
  return (
    <div className="relative flex h-full flex-col px-[4.5vw] pt-[4vh] pb-[9vh]" style={{ background: t.bg, color: t.fg, "--deck-ink": t.fg, "--deck-rust": t.accent, "--deck-ground": t.bg } as React.CSSProperties}>
      <header className={`${mono} flex items-baseline justify-between`} style={{ color: t.soft }}>
        <p>Christer Hagen</p>
        <p className="tabular-nums">
          {slide.chapter} · {pad(index + 1)}/{pad(total)}
        </p>
      </header>
      <section className="min-h-0 flex-1 animate-in pt-[4vh] duration-300 fade-in-0 motion-reduce:animate-none">
        <Body slide={slide} t={t} />
      </section>
    </div>
  )
}
