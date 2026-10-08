"use client"

// Avis: broadsheet på papir. Kolonner, hårfine linjer, store tall.

import { DemoLink, pad, type StageProps } from "./engine"
import type { Slide, Track } from "./content"
import { Braindump, Contributions, Feed, StepFigure, VideoClip } from "./figure"

const c = {
  paper: "#f5f2ea",
  raised: "#fbfaf5",
  ink: "#26231c",
  body: "#36322a",
  meta: "#6d6657",
  rust: "oklch(0.52 0.12 44)",
  rule: "rgb(38 35 28 / 0.16)",
}

const mono = "font-mono uppercase tracking-[0.16em] text-[clamp(0.64rem,0.74vw,0.9rem)] leading-none"
const head = "font-serif font-semibold tracking-[-0.025em] text-balance"
const text = "font-serif text-[clamp(1rem,1.3vw,1.55rem)] leading-[1.38] text-pretty"

function Chip({ track }: { track?: Track }) {
  if (!track) return null
  return (
    <span className={`${mono} inline-block border px-[0.7em] py-[0.5em]`} style={{ borderColor: c.rust, color: c.rust }}>
      For {track.toLowerCase()}
    </span>
  )
}

function Kicker({ slide }: { slide: Slide }) {
  return (
    <div className="flex items-center gap-4">
      <p className={mono} style={{ color: c.rust }}>{slide.eyebrow}</p>
      <Chip track={slide.track} />
    </div>
  )
}

function Rows({ items, keyWidth = "9rem" }: { items: Array<[string, string]>; keyWidth?: string }) {
  return (
    <dl className="m-0 grid">
      {items.map(([k, v], i) => (
        <div
          key={i}
          className="grid items-baseline gap-x-[2vw] border-t py-[clamp(0.7rem,1.6vh,1.4rem)] last:border-b"
          style={{ borderColor: c.rule, gridTemplateColumns: `${keyWidth} 1fr` }}
        >
          <dt className={`${mono} tabular-nums`} style={{ color: c.rust }}>{k}</dt>
          <dd className={`${text} m-0`}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Close({ children }: { children?: string }) {
  if (!children) return null
  return (
    <p className={`${text} mt-[3vh] max-w-[52ch]`} style={{ color: c.rust }}>
      {children}
    </p>
  )
}

function Body({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "cover":
      return (
        <div className="grid h-full grid-cols-12 content-end gap-x-[2vw]">
          <div className="col-span-9">
            <Kicker slide={slide} />
            <h1 className={`${head} mt-[3vh] text-[clamp(3.6rem,8.6vw,10.5rem)] leading-[0.9]`}>{slide.title}</h1>
          </div>
          <p className={`${text} col-span-3 self-end border-t pt-[2vh]`} style={{ borderColor: c.ink, color: c.body }}>
            {slide.lead}
          </p>
        </div>
      )
    case "end":
      return (
        <div className="flex h-full flex-col items-start justify-end">
          <p className={mono} style={{ color: c.rust }}>{slide.eyebrow}</p>
          <h2 className={`${head} mt-[2vh] text-[clamp(4rem,12vw,14rem)] leading-[0.88]`}>{slide.title}</h2>
          <p className={`${mono} mt-[4vh] tabular-nums`} style={{ color: c.meta }}>{slide.lead}</p>
        </div>
      )
    case "statement":
      return (
        <div className="grid h-full grid-cols-12 content-center gap-x-[3vw]">
          <div className="col-span-6">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2.4rem,4.6vw,5.6rem)] leading-[0.98]`}>{slide.title}</h2>
            {slide.body ? <p className={`${text} mt-[3vh] max-w-[40ch]`} style={{ color: c.body }}>{slide.body}</p> : null}
          </div>
          <div className="col-span-6 self-center">
            {slide.items ? <Rows items={slide.items} /> : null}
            <Close>{slide.close}</Close>
          </div>
        </div>
      )
    case "steps":
      return (
        <div className="flex h-full flex-col justify-center">
          <Kicker slide={slide} />
          <h2 className={`${head} mt-[2.4vh] text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.98]`}>{slide.title}</h2>
          <div className="mt-[5vh] grid" style={{ gridTemplateColumns: `repeat(${slide.steps.length}, minmax(0,1fr))` }}>
            {slide.steps.map((s, i) => (
              <div key={s.n} className={`pr-[2vw] ${i > 0 ? "border-l pl-[2vw]" : ""}`} style={{ borderColor: c.rule }}>
                <p className={`${head} text-[clamp(3rem,6vw,7rem)] leading-none tabular-nums`} style={{ color: c.rust }}>{s.n}</p>
                <p className={`${head} mt-[2.4vh] text-[clamp(1.2rem,1.8vw,2.1rem)] leading-[1.1]`}>{s.title}</p>
                <p className={`${text} mt-[1.6vh]`} style={{ color: c.body }}>{s.text}</p>
              </div>
            ))}
          </div>
          <Close>{slide.close}</Close>
        </div>
      )
    case "agents":
      return (
        <div className="flex h-full flex-col justify-center">
          <div className="flex items-end justify-between gap-8">
            <div>
              <Kicker slide={slide} />
              <h2 className={`${head} mt-[2vh] text-[clamp(2rem,3.6vw,4.4rem)] leading-[0.98]`}>{slide.title}</h2>
            </div>
            <p className={`${text} max-w-[30ch] text-end`} style={{ color: c.rust }}>{slide.close}</p>
          </div>
          <div className="mt-[4vh] grid grid-cols-4 border-t" style={{ borderColor: c.ink }}>
            {slide.agents.map((a, i) => (
              <div
                key={a.name}
                className={`border-b py-[2vh] pr-[1.4vw] ${i % 4 ? "border-l pl-[1.4vw]" : ""}`}
                style={{ borderColor: c.rule }}
              >
                <p className={mono} style={{ color: c.meta }}>{a.role} · {a.mode}</p>
                <p className={`${head} mt-[1.4vh] text-[clamp(1.2rem,1.7vw,2rem)] leading-[1.05]`}>{a.name}</p>
                <p className="mt-[1vh] font-serif text-[clamp(0.9rem,1.08vw,1.3rem)] leading-[1.35] text-pretty" style={{ color: c.body }}>{a.does}</p>
                {a.track ? <div className="mt-[1.4vh]"><Chip track={a.track} /></div> : null}
              </div>
            ))}
          </div>
        </div>
      )
    case "timeline":
      return (
        <div className="grid h-full grid-cols-12 content-center gap-x-[3vw]">
          <div className="col-span-5">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.98]`}>{slide.title}</h2>
            {slide.body ? <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p> : null}
            <Close>{slide.close}</Close>
          </div>
          <ol className="col-span-7 m-0 list-none self-center p-0">
            {slide.events.map(([t, v], i) => (
              <li key={i} className="grid grid-cols-[minmax(7rem,0.38fr)_1fr] items-baseline gap-x-[2vw] border-t py-[1.8vh] last:border-b" style={{ borderColor: c.rule }}>
                <span className={`${head} text-[clamp(1.4rem,2.5vw,3rem)] leading-none tabular-nums`} style={{ color: c.rust }}>{t}</span>
                <span className={text}>{v}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    case "stats":
      return (
        <div className="grid h-full grid-cols-12 content-center gap-x-[3vw]">
          <div className="col-span-5">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2.4rem,4.6vw,5.6rem)] leading-[0.98]`}>{slide.title}</h2>
            {slide.body ? <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p> : null}
          </div>
          <div className="col-span-7 self-center">
            {slide.stats.map(([v, l]) => (
              <div key={v} className="flex items-baseline gap-[2vw] border-t py-[1.4vh] last:border-b" style={{ borderColor: c.rule }}>
                <span className={`${head} w-[45%] shrink-0 text-[clamp(2.8rem,6vw,7.2rem)] leading-none tabular-nums`}>{v}</span>
                <span className={text} style={{ color: c.body }}>{l}</span>
              </div>
            ))}
            <Close>{slide.close}</Close>
          </div>
        </div>
      )
    case "code":
      return (
        <div className="grid h-full grid-cols-12 content-center gap-x-[3vw]">
          <div className="col-span-5">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.98]`}>{slide.title}</h2>
            <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <pre
            className="col-span-7 m-0 self-center border px-[2vw] py-[3vh] font-mono text-[clamp(0.74rem,1vw,1.2rem)] leading-[1.6]"
            style={{ borderColor: c.rule, background: c.raised, color: c.ink }}
          >
            {slide.code}
          </pre>
        </div>
      )
    case "demo":
      return (
        <div className="flex h-full flex-col justify-center">
          <Kicker slide={slide} />
          <h2 className={`${head} mt-[2.6vh] max-w-[18ch] text-[clamp(2.4rem,4.6vw,5.6rem)] leading-[0.98]`}>{slide.title}</h2>
          <p className={`${text} mt-[2.4vh]`} style={{ color: c.body }}>{slide.body}</p>
          <ul className="m-0 mt-[4vh] grid max-w-[64rem] list-none p-0">
            {slide.links.map((l) => (
              <li key={l.href} className="border-t last:border-b" style={{ borderColor: c.ink }}>
                <DemoLink
                  href={l.href}
                  className="group flex items-baseline justify-between gap-8 py-[2.2vh] outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <span className={`${head} text-[clamp(1.6rem,2.8vw,3.4rem)] leading-none underline decoration-1 underline-offset-[0.14em] group-hover:decoration-2`}>
                    {l.label}
                  </span>
                  <span className={mono} style={{ color: c.rust }}>{l.note} ↗</span>
                </DemoLink>
              </li>
            ))}
          </ul>
        </div>
      )
    case "braindump":
      return (
        <div className="grid h-full grid-cols-12 content-center items-center gap-x-[3vw]">
          <div className="col-span-5">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.98]`}>{slide.title}</h2>
            <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <div className="col-span-7">
            <Braindump note={slide.note} result={slide.result} colors={{ ink: c.ink, rust: c.rust, meta: c.meta, rule: c.rule }} />
          </div>
        </div>
      )
    case "video":
      return (
        <div className="grid h-full grid-cols-12 content-center items-center gap-x-[3vw]">
          <div className="col-span-4">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2rem,3.6vw,4.4rem)] leading-[0.98]`}>{slide.title}</h2>
            <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p>
            <p className={`${mono} mt-[3vh] normal-case`} style={{ color: c.meta }}>
              <DemoLink href={slide.href} className="underline">{slide.credit} ↗</DemoLink>
            </p>
          </div>
          <VideoClip className="col-span-8" src={slide.src} poster={slide.poster} colors={{ ink: c.ink, rust: c.rust, meta: c.meta, rule: c.rule }} />
        </div>
      )
    case "feed":
      return (
        <div className="grid h-full grid-cols-12 content-center items-center gap-x-[3vw]">
          <div className="col-span-6">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.98]`}>{slide.title}</h2>
            <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <div className="col-span-6">
            <Feed handle={slide.handle} posts={slide.posts} colors={{ ink: c.ink, rust: c.rust, meta: c.meta, rule: c.rule, ground: c.raised, tile: c.paper }} />
          </div>
        </div>
      )
    case "github":
      return (
        <div className="flex h-full flex-col justify-center">
          <Kicker slide={slide} />
          <h2 className={`${head} mt-[2.4vh] text-[clamp(2rem,3.6vw,4.4rem)] leading-[0.98]`}>{slide.title}</h2>
          <div className="mt-[3.6vh]">
            <Contributions colors={{ rust: c.rust, rule: c.rule, meta: c.meta }} />
            <p className={`${mono} mt-[1.6vh] normal-case`} style={{ color: c.meta }}>{slide.caption}</p>
          </div>
          <div className="mt-[3.6vh] grid grid-cols-3 border-t" style={{ borderColor: c.ink }}>
            {slide.who.map(([track, line, joke], i) => (
              <div key={track} className={`pt-[2vh] pr-[2vw] ${i ? "border-l pl-[2vw]" : ""}`} style={{ borderColor: c.rule }}>
                <Chip track={track} />
                <p className={`${head} mt-[1.6vh] text-[clamp(1.1rem,1.6vw,1.9rem)] leading-[1.15]`}>{line}</p>
                <p className={`${text} mt-[1vh]`} style={{ color: c.body }}>{joke}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case "figure":
      return (
        <div className="grid h-full grid-cols-12 content-center items-center gap-x-[3vw]">
          <div className="col-span-5">
            <Kicker slide={slide} />
            <h2 className={`${head} mt-[2.6vh] text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.98]`}>{slide.title}</h2>
            <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <StepFigure name={slide.figure} className="col-span-7 h-[min(60vh,38rem)] w-full" />
        </div>
      )
    case "tracks":
      return (
        <div className="flex h-full flex-col justify-center">
          <Kicker slide={slide} />
          <h2 className={`${head} mt-[2.4vh] text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.98]`}>{slide.title}</h2>
          <div className="mt-[5vh] grid grid-cols-3 border-t" style={{ borderColor: c.ink }}>
            {slide.tracks.map(([t, v], i) => (
              <div key={t} className={`pt-[2.4vh] pr-[2vw] ${i ? "border-l pl-[2vw]" : ""}`} style={{ borderColor: c.rule }}>
                <Chip track={t} />
                <p className={`${head} mt-[2vh] text-[clamp(1.2rem,1.9vw,2.3rem)] leading-[1.15]`}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      )
  }
}

export function AvisStage({ slide, index, total }: StageProps) {
  return (
    <div className="flex h-full flex-col px-[4.5vw] pt-[3.6vh] pb-[3.4vh]" style={{ background: c.paper, color: c.ink }}>
      <header className="flex items-baseline justify-between gap-8 border-b-[3px] border-double pb-[1.4vh]" style={{ borderColor: c.ink }}>
        <p className={mono}>Christer Hagen</p>
        <p className={`${mono} font-semibold`} style={{ color: c.rust }}>{slide.chapter}</p>
        <p className={`${mono} tabular-nums`} style={{ color: c.meta }}>PBL Mentor · 8. oktober 2026</p>
      </header>
      <section className="min-h-0 flex-1 animate-in py-[4vh] duration-300 fade-in-0 motion-reduce:animate-none">
        <Body slide={slide} />
      </section>
      <footer className="flex items-baseline justify-between border-t pt-[1.4vh]" style={{ borderColor: c.rule }}>
        <p className={mono} style={{ color: c.meta }}>Slik bygger du et AI‑native selskap</p>
        <p className={`${mono} tabular-nums`} style={{ color: c.meta }}>Side {pad(index + 1)} av {pad(total)}</p>
      </footer>
    </div>
  )
}
