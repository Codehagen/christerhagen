"use client"

// Kontrollrom: nettstedets blekk som flate, papir som tekst, rust
// dempet for mørkt. Ingen kort, ingen glød — hårfine linjer og en kapittelskinne.

import { DemoLink, pad, type StageProps } from "./engine"
import { Braindump, Contributions, Feed, Profile, Reorder, StepFigure, VideoClip } from "./figure"
import type { Chapter, Slide, Track } from "./content"

// Utledet fra nettstedets --ink / --paper / --rust, ikke valgt fritt.
const c = {
  ground: "oklch(0.235 0.01 80)", // --ink, litt dypere så papirteksten får luft
  sunk: "oklch(0.205 0.008 80)", // kodeblokken: ett trinn ned, ikke en boks med skygge
  line: "oklch(0.34 0.012 80)", // solid i mørkt — alfa-linjer gløder
  ink: "oklch(0.955 0.012 85)", // --paper
  body: "oklch(0.84 0.014 85)",
  meta: "oklch(0.7 0.018 80)",
  rust: "oklch(0.74 0.085 52)", // --rust løftet i L og dempet i C for mørk flate
}

const label = "font-mono uppercase tracking-[0.14em] text-[clamp(0.62rem,0.72vw,0.88rem)] leading-none"
const head = "font-serif font-semibold tracking-[-0.02em] text-balance"
const text = "font-serif text-[clamp(1rem,1.25vw,1.5rem)] leading-[1.42] text-pretty"

const chapters: Chapter[] = ["Intro", "AI", "Docdir", "Advanti", "Tunnel", "Verid", "Fremover"]

function Eyebrow({ slide }: { slide: Slide }) {
  return (
    <p className={label} style={{ color: c.meta }}>
      {slide.eyebrow}
      {slide.track ? <span style={{ color: c.rust }}> · For {slide.track.toLowerCase()}</span> : null}
    </p>
  )
}

function Title({ slide, big = false }: { slide: Slide; big?: boolean }) {
  return (
    <>
      <Eyebrow slide={slide} />
      <h2 className={`${head} mt-[2.2vh] max-w-[22ch] ${big ? "text-[clamp(2.4rem,4.4vw,5.4rem)]" : "text-[clamp(1.9rem,3.2vw,3.9rem)]"} leading-[1]`}>
        {slide.title}
      </h2>
    </>
  )
}

function Close({ children }: { children?: string }) {
  if (!children) return null
  return (
    <p className={`${text} mt-[3.2vh] max-w-[56ch]`} style={{ color: c.rust }}>
      {children}
    </p>
  )
}

/** Rader med hårfin linje mellom — samme grep overalt, i stedet for kort. */
function Rows({ items, keyCol = "10rem" }: { items: Array<[string, string]>; keyCol?: string }) {
  return (
    <dl className="m-0 mt-[4vh] grid border-t" style={{ borderColor: c.line }}>
      {items.map(([k, v], i) => (
        <div key={i} className="grid items-baseline gap-x-[2vw] border-b py-[1.7vh]" style={{ borderColor: c.line, gridTemplateColumns: `${keyCol} 1fr` }}>
          <dt className="font-mono text-[clamp(0.8rem,1vw,1.2rem)] tabular-nums" style={{ color: c.rust }}>{k}</dt>
          <dd className={`${text} m-0`}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Columns({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mt-[4.4vh] grid border-t" style={{ borderColor: c.line, gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
      {children}
    </div>
  )
}

function Col({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <div className={`pt-[2.4vh] pr-[1.8vw] ${i ? "border-l pl-[1.8vw]" : ""}`} style={{ borderColor: c.line }}>
      {children}
    </div>
  )
}

function Body({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "cover":
      return (
        <div className="flex h-full flex-col justify-center">
          <p className={label} style={{ color: c.meta }}>{slide.eyebrow}</p>
          <h1 className={`${head} mt-[3vh] max-w-[13ch] text-[clamp(3.2rem,7vw,8.6rem)] leading-[0.92]`}>{slide.title}</h1>
          <p className={`${text} mt-[4vh] max-w-[46ch]`} style={{ color: c.body }}>{slide.lead}</p>
        </div>
      )
    case "end":
      return (
        <div className="flex h-full flex-col justify-center">
          <p className={label} style={{ color: c.meta }}>{slide.eyebrow}</p>
          <h2 className={`${head} mt-[2vh] text-[clamp(4rem,10vw,12rem)] leading-[0.9]`}>{slide.title}</h2>
          <p className="mt-[4vh] font-mono text-[clamp(0.85rem,1.05vw,1.25rem)] tabular-nums" style={{ color: c.body }}>{slide.lead}</p>
        </div>
      )
    case "statement":
      return (
        <div className="flex h-full flex-col justify-center">
          <Title slide={slide} big />
          {slide.body ? <p className={`${text} mt-[3vh] max-w-[54ch]`} style={{ color: c.body }}>{slide.body}</p> : null}
          {slide.items ? <Rows items={slide.items} /> : null}
          <Close>{slide.close}</Close>
        </div>
      )
    case "steps":
      return (
        <div className="flex h-full flex-col justify-center">
          <Title slide={slide} />
          <Columns n={slide.steps.length}>
            {slide.steps.map((s, i) => (
              <Col key={s.n} i={i}>
                <p className="font-mono text-[clamp(0.8rem,1vw,1.2rem)] tabular-nums" style={{ color: c.rust }}>{s.n}</p>
                <p className={`${head} mt-[2vh] text-[clamp(1.3rem,1.9vw,2.3rem)] leading-[1.08]`}>{s.title}</p>
                <p className={`${text} mt-[1.4vh]`} style={{ color: c.body }}>{s.text}</p>
              </Col>
            ))}
          </Columns>
          <Close>{slide.close}</Close>
        </div>
      )
    case "agents": {
      const hub = slide.agents.find((a) => a.mode === "Alltid på")!
      const daemon = slide.agents.find((a) => a.role === "Bakgrunn")!
      const units = slide.agents.filter((a) => a !== hub && a !== daemon)
      const n = units.length
      const cmo = units.findIndex((a) => a.role === "Marked")
      // Linjene er kanter på tomme elementer — ingen SVG, så de følger
      // rutenettet uansett skjermbredde.
      const stub = <div aria-hidden="true" className="mx-auto h-[2.2vh] w-px" style={{ background: c.line }} />
      return (
        <div className="flex h-full flex-col justify-center">
          <div className="flex items-end justify-between gap-8">
            <div>
              <Title slide={slide} />
            </div>
            <p className={`${text} max-w-[28ch] text-end`} style={{ color: c.rust }}>{slide.close}</p>
          </div>

          <div className="mt-[3.2vh]">
            {/* Menneskene */}
            <div className="mx-auto w-fit border px-[1.6vw] py-[1vh] text-center" style={{ borderColor: c.line }}>
              <p className={label} style={{ color: c.meta }}>Mennesker</p>
              <p className={`${head} mt-[0.8vh] text-[clamp(1rem,1.3vw,1.55rem)]`}>Meglerne</p>
            </div>
            {stub}

            {/* Viktor, med nattskiftet på siden */}
            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center">
              <div />
              <div className="border px-[2vw] py-[1.4vh] text-center" style={{ borderColor: c.rust }}>
                <p className={label} style={{ color: c.rust }}>{hub.role} · {hub.mode}</p>
                <p className={`${head} mt-[0.8vh] text-[clamp(1.3rem,1.8vw,2.2rem)]`}>{hub.name}</p>
                <p className="mt-[0.6vh] max-w-[30ch] font-serif text-[clamp(0.85rem,1vw,1.2rem)] leading-[1.35]" style={{ color: c.body }}>{hub.does}</p>
              </div>
              <div className="flex items-center">
                <div aria-hidden="true" className="h-px w-[3vw] border-t border-dashed" style={{ borderColor: c.line }} />
                <div className="border border-dashed px-[1.2vw] py-[1vh]" style={{ borderColor: c.line }}>
                  <p className={label} style={{ color: c.meta }}>{daemon.role} · {daemon.mode}</p>
                  <p className={`${head} mt-[0.6vh] text-[clamp(0.95rem,1.2vw,1.45rem)]`}>{daemon.name}</p>
                  <p className="mt-[0.4vh] font-serif text-[clamp(0.8rem,0.92vw,1.1rem)]" style={{ color: c.meta }}>{daemon.does}</p>
                </div>
              </div>
            </div>
            {stub}

            {/* Spesialistene: en buss fra midten av første til midten av siste kolonne */}
            <div className="relative grid gap-x-[1.2vw]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
              <div
                aria-hidden="true"
                className="absolute top-0 h-px"
                style={{ background: c.line, left: `calc(${50 / n}% - ${(1.2 * (n - 1)) / (2 * n)}vw)`, right: `calc(${50 / n}% - ${(1.2 * (n - 1)) / (2 * n)}vw)` }}
              />
              {units.map((a) => (
                <div key={a.name}>
                  {stub}
                  <div className="h-full border px-[1vw] py-[1.4vh]" style={{ borderColor: c.line }}>
                    <p className={label} style={{ color: c.meta }}>{a.role}</p>
                    <p className={`${head} mt-[0.8vh] text-[clamp(1rem,1.35vw,1.65rem)] leading-[1.1]`}>{a.name}</p>
                    <p className="mt-[0.6vh] font-serif text-[clamp(0.82rem,0.96vw,1.16rem)] leading-[1.35] text-pretty" style={{ color: c.body }}>{a.does}</p>
                    <p className="mt-[0.8vh] font-mono text-[clamp(0.66rem,0.76vw,0.92rem)]" style={{ color: a.track ? c.rust : c.meta }}>
                      {a.mode}{a.track ? ` · ${a.track}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CMO-teamet rett under CMO */}
            <div className="grid gap-x-[1.2vw]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
              <div style={{ gridColumn: `${cmo + 1}` }}>
                {stub}
                <p className="text-center font-mono text-[clamp(0.64rem,0.74vw,0.9rem)] leading-[1.5]" style={{ color: c.meta }}>
                  Blog Writer · Buzz · Strategist · News Curator · Digest
                </p>
              </div>
            </div>

            {/* Hjernen: alle skriver hit, alle leser herfra */}
            <div className="mt-[2.4vh] flex items-baseline justify-between border-t border-b px-[1vw] py-[1.2vh]" style={{ borderColor: c.rust }}>
              <p className={`${head} text-[clamp(1rem,1.3vw,1.55rem)]`}>Hjernen</p>
              <p className="font-mono text-[clamp(0.7rem,0.82vw,1rem)]" style={{ color: c.meta }}>Alle skriver hit. Alle leser herfra.</p>
            </div>
          </div>
        </div>
      )
    }
    case "timeline":
      return (
        <div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[4vw]">
          <div>
            <Title slide={slide} />
            {slide.body ? <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p> : null}
            <Close>{slide.close}</Close>
          </div>
          <ol className="m-0 list-none border-t p-0" style={{ borderColor: c.line }}>
            {slide.events.map(([t, v], i) => (
              <li key={i} className="grid grid-cols-[minmax(6.5rem,auto)_1fr] items-baseline gap-x-[2vw] border-b py-[2vh]" style={{ borderColor: c.line }}>
                <span className="font-mono text-[clamp(0.95rem,1.3vw,1.55rem)] tabular-nums" style={{ color: c.rust }}>{t}</span>
                <span className={text}>{v}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    case "stats":
      return (
        <div className="flex h-full flex-col justify-center">
          <Title slide={slide} big />
          {slide.body ? <p className={`${text} mt-[3vh] max-w-[60ch]`} style={{ color: c.body }}>{slide.body}</p> : null}
          <Columns n={slide.stats.length}>
            {slide.stats.map(([v, l], i) => (
              <Col key={v} i={i}>
                <p className={`${head} text-[clamp(2.4rem,4.8vw,5.8rem)] leading-none tabular-nums`}>{v}</p>
                <p className={`${text} mt-[1.4vh]`} style={{ color: c.meta }}>{l}</p>
              </Col>
            ))}
          </Columns>
          <Close>{slide.close}</Close>
        </div>
      )
    case "code":
      return (
        <div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[4vw]">
          <div>
            <Title slide={slide} />
            <p className={`${text} mt-[3vh]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <pre
            className="m-0 border-l-2 px-[2vw] py-[3vh] font-mono text-[clamp(0.74rem,0.98vw,1.18rem)] leading-[1.62]"
            style={{ background: c.sunk, borderColor: c.rust, color: c.ink }}
          >
            {slide.code}
          </pre>
        </div>
      )
    case "demo":
      return (
        <div className="flex h-full flex-col justify-center">
          <Title slide={slide} big />
          <p className={`${text} mt-[2.4vh]`} style={{ color: c.body }}>{slide.body}</p>
          <ul className="m-0 mt-[4.4vh] grid max-w-[76rem] list-none border-t p-0" style={{ borderColor: c.line }}>
            {slide.links.map((l) => (
              <li key={l.href} className="border-b" style={{ borderColor: c.line }}>
                <DemoLink
                  href={l.href}
                  className="group flex items-baseline justify-between gap-8 py-[2.4vh] outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ outlineColor: c.ink }}
                >
                  <span className={`${head} text-[clamp(1.6rem,2.8vw,3.4rem)] leading-none underline decoration-1 underline-offset-[0.14em] group-hover:decoration-2`} style={{ textDecorationColor: c.rust }}>
                    {l.label}
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-mono text-[clamp(0.75rem,0.9vw,1.08rem)]" style={{ color: c.meta }}>{l.note} ↗</span>
                </DemoLink>
              </li>
            ))}
          </ul>
        </div>
      )
    case "braindump":
      return (
        <div className="grid h-full grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] items-center gap-[5vw]">
          <div>
            <Title slide={slide} />
            <p className={`${text} mt-[3vh] max-w-[34ch]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <Braindump note={slide.note} result={slide.result} colors={{ ink: c.ink, rust: c.rust, meta: c.meta, rule: c.line }} />
        </div>
      )
    case "video":
      return (
        <div className="grid h-full grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] items-center gap-[3.6vw]">
          <div>
            <Title slide={slide} />
            <p className={`${text} mt-[3vh] max-w-[30ch]`} style={{ color: c.body }}>{slide.body}</p>
            <p className="mt-[3vh] font-mono text-[clamp(0.7rem,0.84vw,1.02rem)] leading-[1.6]" style={{ color: c.meta }}>
              <DemoLink href={slide.href} className="underline decoration-1 underline-offset-[0.2em] outline-none focus-visible:outline-2" style={{ textDecorationColor: c.rust }}>
                {slide.credit} ↗
              </DemoLink>
            </p>
          </div>
          <VideoClip src={slide.src} poster={slide.poster} colors={{ ink: c.ink, rust: c.rust, meta: c.meta, rule: c.line }} />
        </div>
      )
    case "feed":
      return (
        <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-[4vw]">
          <div>
            <Title slide={slide} />
            <p className={`${text} mt-[3vh] max-w-[38ch]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <Feed
            handle={slide.handle}
            posts={slide.posts}
            colors={{ ink: c.ink, rust: c.rust, meta: c.meta, rule: c.line, ground: c.sunk, tile: c.ground }}
          />
        </div>
      )
    case "github":
      return (
        <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[4vw]">
          <Profile companies={slide.companies} colors={{ ink: c.ink, meta: c.meta, body: c.body, rule: c.line, rust: c.rust }} />
          <div>
            <Title slide={slide} />
            <div className="mt-[3.6vh]">
              <Contributions colors={{ rust: c.rust, rule: c.line, meta: c.meta }} />
              <p className="mt-[1.6vh] font-mono text-[clamp(0.72rem,0.86vw,1.04rem)]" style={{ color: c.meta }}>{slide.caption}</p>
            </div>
            <Columns n={3}>
              {slide.who.map(([track, line, joke], i) => (
                <Col key={track} i={i}>
                  <p className={label} style={{ color: c.rust }}>For {track.toLowerCase()}</p>
                  <p className={`${head} mt-[1.6vh] text-[clamp(1.05rem,1.45vw,1.75rem)] leading-[1.15]`}>{line}</p>
                  <p className={`${text} mt-[1vh]`} style={{ color: c.body }}>{joke}</p>
                </Col>
              ))}
            </Columns>
          </div>
        </div>
      )
    case "principles":
      return (
        <div className="grid h-full grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-[4.5vw]">
          <div>
            <Title slide={slide} />
            <p className={`${text} mt-[3vh] max-w-[46ch]`} style={{ color: c.body }}>{slide.body}</p>
            <Rows items={slide.questions} keyCol="7rem" />
            <Close>{slide.close}</Close>
          </div>
          <Reorder colors={{ ink: c.ink, rust: c.rust, meta: c.meta, rule: c.line, body: c.body }} />
        </div>
      )
    case "figure":
      return (
        <div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[4vw]">
          <div>
            <Title slide={slide} />
            <p className={`${text} mt-[3vh] max-w-[38ch]`} style={{ color: c.body }}>{slide.body}</p>
            <Close>{slide.close}</Close>
          </div>
          <StepFigure name={slide.figure} className="h-[min(64vh,40rem)] w-full" />
        </div>
      )
    case "tracks":
      return (
        <div className="flex h-full flex-col justify-center">
          <Title slide={slide} />
          <Columns n={3}>
            {slide.tracks.map(([t, v]: [Track, string], i) => (
              <Col key={t} i={i}>
                <p className={label} style={{ color: c.rust }}>{t}</p>
                <p className={`${head} mt-[2vh] text-[clamp(1.2rem,1.8vw,2.2rem)] leading-[1.18]`}>{v}</p>
              </Col>
            ))}
          </Columns>
        </div>
      )
  }
}

export function KontrollromStage({ slide, index, total }: StageProps) {
  const current = chapters.indexOf(slide.chapter)
  return (
    <div
      className="grid h-full grid-cols-[clamp(11rem,15vw,16rem)_1fr]"
      style={
        {
          background: c.ground,
          color: c.ink,
          // Tegningene fra det gamle dekket leser blekket herfra.
          "--deck-ink": c.ink,
          "--deck-rust": c.rust,
          "--deck-ground": c.ground,
        } as React.CSSProperties
      }
    >
      {/* Kapittelskinna: det ene valget som er dette dekkets eget. Salen ser
          hvor i historien de er, uten at noe blinker. */}
      <aside className="flex flex-col border-r px-[1.6vw] py-[4vh]" style={{ borderColor: c.line }}>
        <p className={label}>Christer Hagen</p>
        <p className={`${label} mt-[1.2vh]`} style={{ color: c.meta }}>PBL Mentor · 8.10</p>
        <ol className="m-0 mt-[7vh] grid list-none gap-[2vh] p-0">
          {chapters.map((ch, i) => (
            <li
              key={ch}
              className="border-l-2 pl-[0.9vw] font-serif text-[clamp(0.95rem,1.15vw,1.4rem)] leading-none"
              style={{
                borderColor: i === current ? c.rust : "transparent",
                color: i === current ? c.ink : i < current ? c.meta : c.body,
              }}
            >
              {ch}
            </li>
          ))}
        </ol>
        <p className="mt-auto font-mono text-[clamp(0.72rem,0.86vw,1.04rem)] tabular-nums" style={{ color: c.meta }}>
          {pad(index + 1)} / {pad(total)}
        </p>
      </aside>
      <section className="min-h-0 animate-in px-[4.5vw] py-[6vh] duration-300 fade-in-0 motion-reduce:animate-none">
        <Body slide={slide} />
      </section>
    </div>
  )
}

