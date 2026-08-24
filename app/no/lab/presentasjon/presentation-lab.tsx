"use client"

import {
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  defaultPresentationStyle,
  presentationModes,
  renderPresentationStyle,
  type PresentationStyleConfig,
} from "@/lib/presentation-style"

const controls = [
  { key: "glow", label: "Glød", min: 0, max: 1, step: 0.01 },
  { key: "lineWeight", label: "Linjevekt", min: 0.75, max: 2.4, step: 0.05 },
  { key: "jitter", label: "Ujevnhet", min: 0, max: 8, step: 0.1 },
  { key: "texture", label: "Tekstur", min: 0, max: 0.8, step: 0.01 },
  { key: "gridDensity", label: "Rutenett", min: 12, max: 32, step: 1 },
  { key: "annotation", label: "Håndskrift", min: 0, max: 1, step: 0.01 },
] as const

const storageKey = "christer-presentation-styles"

function freshSeed() {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return values[0]
}

function readSavedStyles(): PresentationStyleConfig[] {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as PresentationStyleConfig[]) : []
  } catch {
    return []
  }
}

export function PresentationLab() {
  const [config, setConfig] = useState(defaultPresentationStyle)
  const [saved, setSaved] = useState<PresentationStyleConfig[]>([])
  const [message, setMessage] = useState("")
  const scene = useMemo(() => renderPresentationStyle(config), [config])

  useEffect(() => {
    const timer = window.setTimeout(() => setSaved(readSavedStyles()), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const update = <Key extends keyof PresentationStyleConfig>(
    key: Key,
    value: PresentationStyleConfig[Key],
  ) => setConfig((current) => ({ ...current, [key]: value }))

  const regenerate = () => {
    update("seed", freshSeed())
    setMessage("")
  }

  const save = async () => {
    const json = JSON.stringify(config, null, 2)
    await navigator.clipboard.writeText(json)

    const nextSaved = [config, ...saved.filter((item) => item.seed !== config.seed)].slice(0, 6)
    setSaved(nextSaved)
    localStorage.setItem(storageKey, JSON.stringify(nextSaved))

    try {
      const response = await fetch("/api/lab/presentation-style", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: json,
      })
      if (!response.ok) throw new Error("write unavailable")
      const result = (await response.json()) as { path: string }
      setMessage(`Lagret og kopiert · ${result.path}`)
    } catch {
      setMessage("Kopiert til utklippstavlen · lokal fillagring er kun tilgjengelig i dev")
    }
  }

  const canvasStyle: CSSProperties = {
    backgroundColor: scene.palette.background,
    color: scene.palette.foreground,
  }

  const glowStrength = config.mode === "plotter" ? 0 : config.glow
  const traceShadow = `drop-shadow(0 0 ${2 + glowStrength * 8}px ${scene.palette.accent})`

  return (
    <main className="min-h-dvh bg-[#15110e] px-4 py-5 text-[#f1e6d1] [font-synthesis:none] sm:px-6 lg:h-dvh lg:overflow-hidden lg:px-8">
      <div className="mx-auto grid h-full max-w-[1680px] gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="flex min-w-0 flex-col">
          <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[0.75rem] leading-none tracking-[0.16em] text-[#b7a995] uppercase">
                Christerhagen.no · presentasjonslab
              </p>
              <h1 className="mt-2 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-normal tracking-[-0.025em] text-balance">
                Varm vektormaskin
              </h1>
            </div>
            <p className="font-mono text-[0.75rem] leading-none text-[#b7a995] tabular-nums">
              seed {config.seed}
            </p>
          </header>

          <button
            type="button"
            onClick={regenerate}
            className="group relative block aspect-video w-full min-h-0 flex-1 cursor-crosshair overflow-hidden rounded-[2px] border border-[#4b4036] text-start outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a1f] focus-visible:ring-offset-4 focus-visible:ring-offset-[#15110e]"
            style={canvasStyle}
            aria-label="Lag en ny visuell variasjon"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 960 540"
              className="absolute inset-0 size-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="lab-grid"
                  width={config.gridDensity}
                  height={config.gridDensity}
                  patternUnits="userSpaceOnUse"
                  x={scene.gridOffset.x}
                  y={scene.gridOffset.y}
                >
                  <path
                    d={`M ${config.gridDensity} 0 L 0 0 0 ${config.gridDensity}`}
                    fill="none"
                    stroke={scene.palette.grid}
                    strokeWidth="0.7"
                    opacity="0.42"
                  />
                </pattern>
              </defs>
              <rect width="960" height="540" fill="url(#lab-grid)" />
              {scene.grain.map((dot, index) => (
                <circle
                  key={index}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r}
                  fill={scene.palette.foreground}
                  opacity={dot.opacity}
                />
              ))}
              <g
                fill="none"
                stroke={scene.palette.accent}
                strokeWidth={config.lineWeight}
                strokeLinejoin="round"
                style={{ filter: traceShadow }}
              >
                {scene.traces.map((trace) => (
                  <path key={trace.id} d={trace.d} opacity={trace.opacity} />
                ))}
              </g>
              <path
                d="M96 456 H864"
                stroke={scene.palette.muted}
                strokeWidth="0.8"
                opacity="0.48"
              />
              {[130, 330, 520].map((x, index) => (
                <g key={x}>
                  <circle
                    cx={x}
                    cy={index === 0 ? 300 : index === 1 ? 250 : 200}
                    r={scene.highlightIndex === index ? 8 : 4}
                    fill={scene.highlightIndex === index ? scene.palette.accent : scene.palette.background}
                    stroke={scene.palette.accent}
                    strokeWidth={config.lineWeight}
                  />
                </g>
              ))}
            </svg>

            <span aria-hidden="true" className="absolute inset-x-[7%] top-[8%] flex items-center justify-between font-mono text-[clamp(0.65rem,1vw,0.9rem)] tracking-[0.13em] uppercase opacity-70">
              <span>Tre nivåer · kunstig intelligens</span>
              <span className="tabular-nums">03 / 16</span>
            </span>
            <span aria-hidden="true" className="absolute inset-x-[7%] top-[18%] block max-w-[13ch] text-[clamp(2.5rem,6.7vw,7rem)] leading-[0.9] font-normal tracking-[-0.045em] text-balance">
              AI gjør jobben.
            </span>
            <span
              aria-hidden="true"
              className="absolute block max-w-[18ch] font-serif text-[clamp(1rem,2.1vw,2.3rem)] leading-[1.1] italic transition-opacity"
              style={{
                left: `${(scene.annotation.x / 960) * 100}%`,
                top: `${(scene.annotation.y / 540) * 100}%`,
                color: scene.palette.muted,
                opacity: config.annotation,
                transform: `rotate(${scene.annotation.rotate}deg)`,
              }}
            >
              fra å spørre til å delegere
            </span>
            <span aria-hidden="true" className="absolute inset-x-[7%] bottom-[7%] flex items-end justify-between gap-6 font-mono text-[clamp(0.65rem,1vw,0.9rem)] leading-[1.45] tracking-[0.04em] opacity-75">
              <span className="max-w-[38ch]">Chat → agentic AI → generativ UI</span>
              <span className="opacity-0 transition-opacity group-hover:opacity-100">Klikk for ny variasjon</span>
            </span>
          </button>
        </section>

        <aside className="min-w-0 border-t border-[#40362e] pt-5 lg:overflow-y-auto lg:border-t-0 lg:border-s lg:ps-5 lg:pt-0">
          <div className="grid gap-2" aria-label="Visuell modus">
            {presentationModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => update("mode", mode.id)}
                className={`min-h-11 border px-3 py-2 text-start font-mono text-[0.8125rem] leading-none transition-colors ${
                  config.mode === mode.id
                    ? "border-[#ff5a1f] bg-[#ff5a1f] text-[#160c08]"
                    : "border-[#40362e] text-[#c7baa7] hover:border-[#766657] hover:text-[#f1e6d1]"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-5">
            {controls.map((control) => (
              <label key={control.key} className="grid gap-2">
                <span className="flex items-baseline justify-between gap-4 font-mono text-[0.75rem] leading-none text-[#c7baa7]">
                  <span>{control.label}</span>
                  <span className="tabular-nums text-[#8f8171]">
                    {config[control.key].toFixed(control.step < 0.1 ? 2 : 1)}
                  </span>
                </span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={config[control.key]}
                  onChange={(event) => update(control.key, Number(event.target.value))}
                  className="h-6 w-full cursor-pointer accent-[#ff5a1f]"
                />
              </label>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={regenerate}
              className="min-h-11 border border-[#40362e] px-3 font-mono text-[0.75rem] text-[#f1e6d1] transition-colors hover:border-[#766657]"
            >
              Ny seed
            </button>
            <button
              type="button"
              onClick={save}
              className="min-h-11 bg-[#f1e6d1] px-3 font-mono text-[0.75rem] text-[#160c08] transition-colors hover:bg-white"
            >
              Lagre
            </button>
          </div>

          {message ? (
            <p className="mt-3 [overflow-wrap:anywhere] font-mono text-[0.75rem] leading-[1.5] text-[#b7a995]" role="status">
              {message}
            </p>
          ) : null}

          {saved.length > 0 ? (
            <section className="mt-8">
              <h2 className="font-mono text-[0.6875rem] leading-none tracking-[0.14em] text-[#8f8171] uppercase">
                Lagrede uttrykk
              </h2>
              <div className="mt-3 grid gap-2">
                {saved.map((item) => (
                  <button
                    key={`${item.mode}-${item.seed}`}
                    type="button"
                    onClick={() => setConfig(item)}
                    className="flex min-h-11 items-center justify-between gap-3 border border-[#40362e] px-3 font-mono text-[0.75rem] text-[#c7baa7] transition-colors hover:border-[#766657] hover:text-[#f1e6d1]"
                  >
                    <span>{presentationModes.find((mode) => mode.id === item.mode)?.label}</span>
                    <span className="tabular-nums text-[#8f8171]">{item.seed}</span>
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
