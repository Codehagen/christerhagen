"use client"

import { useEffect, useState } from "react"

import { DeckVisual } from "@/components/deck-visual"
import {
  defaultDeckVisual,
  renderDeckVisual,
  visualModes,
  visualSolids,
  visualSubstrates,
  type DeckVisualConfig,
} from "@/lib/deck-visual"

const knobs = [
  { key: "density", label: "Tetthet", min: 0.15, max: 1, step: 0.01 },
  { key: "lineWeight", label: "Linjevekt", min: 0.4, max: 3, step: 0.05 },
  { key: "wobble", label: "Slark", min: 0, max: 4, step: 0.05 },
  { key: "backlash", label: "Overskyting", min: 0, max: 3, step: 0.05 },
  { key: "bloom", label: "Knekkglød", min: 0, max: 1, step: 0.01 },
  { key: "halo", label: "Halation", min: 0, max: 1, step: 0.01 },
  { key: "misregistration", label: "Feilregister", min: 0, max: 4, step: 0.1 },
  { key: "secondInk", label: "Andreblekk", min: 0, max: 1, step: 0.01 },
  { key: "overdraw", label: "Overtegning", min: 1, max: 3, step: 1 },
  { key: "perspective", label: "Perspektiv", min: 0, max: 1, step: 0.01 },
  { key: "rotation", label: "Rotasjon", min: 0, max: 360, step: 1 },
  { key: "hatch", label: "Skravur", min: 0, max: 1, step: 0.01 },
  { key: "hatchAngle", label: "Skravurvinkel", min: 0, max: 180, step: 1 },
  { key: "fibre", label: "Fiber", min: 0, max: 1, step: 0.01 },
  { key: "nodeScale", label: "Bokser (org)", min: 0.8, max: 1.15, step: 0.01 },
  { key: "rankGap", label: "Radavstand (org)", min: 0.7, max: 1.3, step: 0.01 },
] as const

const storageKey = "christer-deck-visual"

function freshSeed() {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return values[0]
}

function readSaved(): DeckVisualConfig[] {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as DeckVisualConfig[]) : []
  } catch {
    return []
  }
}

const chip =
  "min-h-9 border px-2.5 py-1.5 text-start font-mono text-[0.75rem] leading-none transition-colors"
const chipOn = "border-[#ff8a2b] bg-[#ff8a2b] text-[#14100c]"
const chipOff =
  "border-[#3b322a] text-[#b4a893] hover:border-[#6f6052] hover:text-[#f2e7d4]"

export function VectorLab() {
  const [config, setConfig] = useState<DeckVisualConfig>(defaultDeckVisual)
  const [saved, setSaved] = useState<DeckVisualConfig[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Utenfor render-passet: localStorage er et eksternt system, ikke state.
    const timer = window.setTimeout(() => setSaved(readSaved()), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const update = <Key extends keyof DeckVisualConfig>(
    key: Key,
    value: DeckVisualConfig[Key],
  ) => {
    setConfig((current) => ({ ...current, [key]: value }))
    setMessage("")
  }

  const save = async () => {
    const json = JSON.stringify(config, null, 2)
    try {
      await navigator.clipboard.writeText(json)
    } catch {
      // Utklippstavlen kan være blokkert; fillagringen under er den som teller.
    }

    const next = [
      config,
      ...saved.filter((item) => item.seed !== config.seed),
    ].slice(0, 8)
    setSaved(next)
    localStorage.setItem(storageKey, JSON.stringify(next))

    try {
      const response = await fetch("/api/lab/deck-visual", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: json,
      })
      if (!response.ok) throw new Error("write unavailable")
      const result = (await response.json()) as { path: string }
      setMessage(`Lagret · ${result.path} · kopiert til utklippstavlen`)
    } catch {
      setMessage("Kopiert til utklippstavlen · fillagring finnes kun i dev")
    }
  }

  const scene = renderDeckVisual(config)

  return (
    <main className="min-h-dvh bg-[#100d0a] px-4 py-5 text-[#f2e7d4] [font-synthesis:none] sm:px-6 lg:h-dvh lg:overflow-hidden lg:px-8">
      <div className="mx-auto grid h-full max-w-[1760px] gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="flex min-w-0 flex-col justify-center">
          <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[0.7rem] leading-none tracking-[0.18em] text-[#9b8b74] uppercase">
                Vektorlaboratorium
              </p>
              <h1 className="mt-2 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.05] font-normal tracking-[-0.03em]">
                Varm vektor
              </h1>
            </div>
            <p className="font-mono text-[0.72rem] leading-[1.6] text-[#9b8b74] tabular-nums">
              seed {config.seed} · {scene.segments} segmenter · oppfrisking{" "}
              {Math.round(scene.refresh * 100)} %
            </p>
          </header>

          <button
            type="button"
            onClick={() => update("seed", freshSeed())}
            className="group relative block aspect-video max-h-full w-full self-center overflow-hidden border border-[#3b322a] outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a2b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#100d0a]"
            aria-label="Ny variasjon"
          >
            <DeckVisual
              config={config}
              idPrefix="lab"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 size-full"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-3 font-mono text-[0.7rem] text-[#f2e7d4] opacity-0 transition-opacity group-hover:opacity-90">
              <span className="bg-[#100d0a]/80 px-2 py-1">Klikk for ny variasjon</span>
            </span>
          </button>
        </section>

        <aside className="min-w-0 border-t border-[#2c251f] pt-5 lg:overflow-y-auto lg:border-t-0 lg:border-s lg:pt-0 lg:ps-5">
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 font-mono text-[0.68rem] leading-none tracking-[0.16em] text-[#9b8b74] uppercase">
              Motiv
            </legend>
            <div className="grid grid-cols-3 gap-1.5">
              {visualModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  title={mode.hint}
                  onClick={() => update("mode", mode.id)}
                  className={`${chip} ${config.mode === mode.id ? chipOn : chipOff}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 mt-5 border-0 p-0">
            <legend className="mb-2 font-mono text-[0.68rem] leading-none tracking-[0.16em] text-[#9b8b74] uppercase">
              Underlag
            </legend>
            <div className="grid grid-cols-3 gap-1.5">
              {visualSubstrates.map((substrate) => (
                <button
                  key={substrate.id}
                  type="button"
                  title={substrate.hint}
                  onClick={() => update("substrate", substrate.id)}
                  className={`${chip} ${
                    config.substrate === substrate.id ? chipOn : chipOff
                  }`}
                >
                  {substrate.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 mt-5 border-0 p-0">
            <legend className="mb-2 font-mono text-[0.68rem] leading-none tracking-[0.16em] text-[#9b8b74] uppercase">
              Legeme <span className="normal-case">(kun motiv «Legeme»)</span>
            </legend>
            <div className="grid grid-cols-2 gap-1.5">
              {visualSolids.map((solid) => (
                <button
                  key={solid.id}
                  type="button"
                  onClick={() => update("solid", solid.id)}
                  className={`${chip} ${config.solid === solid.id ? chipOn : chipOff}`}
                >
                  {solid.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4">
            {knobs.map((knob) => (
              <label key={knob.key} className="grid gap-1.5">
                <span className="flex items-baseline justify-between gap-4 font-mono text-[0.72rem] leading-none text-[#b4a893]">
                  <span>{knob.label}</span>
                  <span className="text-[#8a7b66] tabular-nums">
                    {config[knob.key].toFixed(knob.step >= 1 ? 0 : 2)}
                  </span>
                </span>
                <input
                  type="range"
                  min={knob.min}
                  max={knob.max}
                  step={knob.step}
                  value={config[knob.key]}
                  onChange={(event) =>
                    update(knob.key, Number(event.target.value))
                  }
                  className="h-6 w-full cursor-pointer accent-[#ff8a2b]"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update("seed", freshSeed())}
              className="min-h-11 border border-[#3b322a] px-3 font-mono text-[0.75rem] text-[#f2e7d4] transition-colors hover:border-[#6f6052]"
            >
              Ny seed
            </button>
            <button
              type="button"
              onClick={save}
              className="min-h-11 bg-[#f2e7d4] px-3 font-mono text-[0.75rem] text-[#14100c] transition-colors hover:bg-white"
            >
              Lagre
            </button>
          </div>

          <button
            type="button"
            onClick={() => setConfig(defaultDeckVisual)}
            className="mt-2 min-h-11 w-full border border-[#2c251f] px-3 font-mono text-[0.72rem] text-[#9b8b74] transition-colors hover:border-[#6f6052] hover:text-[#f2e7d4]"
          >
            Tilbake til utgangspunktet
          </button>

          {message ? (
            <p
              role="status"
              className="mt-3 [overflow-wrap:anywhere] font-mono text-[0.72rem] leading-[1.55] text-[#9b8b74]"
            >
              {message}
            </p>
          ) : null}

          {saved.length > 0 ? (
            <section className="mt-7 pb-6">
              <h2 className="font-mono text-[0.68rem] leading-none tracking-[0.16em] text-[#9b8b74] uppercase">
                Lagrede uttrykk
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {saved.map((item) => (
                  <button
                    key={`${item.mode}-${item.substrate}-${item.seed}`}
                    type="button"
                    onClick={() => setConfig(item)}
                    className="group border border-[#2c251f] p-1 text-start transition-colors hover:border-[#6f6052]"
                  >
                    <DeckVisual
                      config={item}
                      idPrefix={`saved-${item.seed}-${item.mode}`}
                      className="block aspect-video w-full"
                    />
                    <span className="mt-1 flex items-baseline justify-between gap-2 px-0.5 font-mono text-[0.66rem] text-[#8a7b66]">
                      <span>
                        {visualModes.find((mode) => mode.id === item.mode)?.label}
                      </span>
                      <span className="tabular-nums">
                        {String(item.seed).slice(-5)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  )
}
