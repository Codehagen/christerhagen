export const presentationModes = [
  { id: "vector", label: "Vectorverksted" },
  { id: "phosphor", label: "Varm fosfor" },
  { id: "plotter", label: "Plotterark" },
] as const

export type PresentationMode = (typeof presentationModes)[number]["id"]

export type PresentationStyleConfig = {
  seed: number
  mode: PresentationMode
  glow: number
  lineWeight: number
  jitter: number
  texture: number
  gridDensity: number
  annotation: number
}

export const defaultPresentationStyle: PresentationStyleConfig = {
  seed: 260824,
  mode: "plotter",
  glow: 0,
  lineWeight: 1.1,
  jitter: 1.8,
  texture: 0.18,
  gridDensity: 24,
  annotation: 0.08,
}

type Point = { x: number; y: number }

export type PresentationScene = {
  palette: {
    background: string
    foreground: string
    muted: string
    accent: string
    grid: string
  }
  grain: Array<{ x: number; y: number; r: number; opacity: number }>
  traces: Array<{ id: string; d: string; opacity: number }>
  gridOffset: { x: number; y: number }
  annotation: { x: number; y: number; rotate: number }
  highlightIndex: number
}

function mulberry32(seed: number) {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

function tracePath(points: Point[], jitter: number, random: () => number) {
  return points
    .map((point, index) => {
      const x = point.x + (random() - 0.5) * jitter
      const y = point.y + (random() - 0.5) * jitter
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")
}

export function renderPresentationStyle(
  config: PresentationStyleConfig,
): PresentationScene {
  const random = mulberry32(config.seed)
  const palettes: Record<PresentationMode, PresentationScene["palette"]> = {
    vector: {
      background: "#0b0907",
      foreground: "#f1e6d1",
      muted: "#b7a995",
      accent: "#ff5a1f",
      grid: "#342a22",
    },
    phosphor: {
      background: "#f05a24",
      foreground: "#1b100b",
      muted: "#63301f",
      accent: "#ffe7c7",
      grid: "#c9471c",
    },
    plotter: {
      background: "#f8f8f4",
      foreground: "#171717",
      muted: "#5d5a54",
      accent: "#ff542d",
      grid: "#d9d7cf",
    },
  }

  const traceBases: Point[][] = [
    [
      { x: 130, y: 300 },
      { x: 264, y: 300 },
      { x: 330, y: 250 },
      { x: 450, y: 250 },
      { x: 520, y: 200 },
      { x: 665, y: 200 },
    ],
    [
      { x: 170, y: 360 },
      { x: 305, y: 360 },
      { x: 365, y: 310 },
      { x: 525, y: 310 },
      { x: 585, y: 260 },
      { x: 760, y: 260 },
    ],
    [
      { x: 96, y: 420 },
      { x: 230, y: 420 },
      { x: 295, y: 370 },
      { x: 455, y: 370 },
      { x: 520, y: 320 },
      { x: 830, y: 320 },
    ],
  ]

  const grainCount = Math.round(30 + config.texture * 110)

  return {
    palette: palettes[config.mode],
    grain: Array.from({ length: grainCount }, () => ({
      x: random() * 960,
      y: random() * 540,
      r: 0.35 + random() * 1.35,
      opacity: (0.025 + random() * 0.09) * config.texture,
    })),
    traces: traceBases.map((points, index) => ({
      id: `trace-${index}`,
      d: tracePath(points, config.jitter * 2.4, random),
      opacity: 0.44 + index * 0.18,
    })),
    gridOffset: {
      x: random() * config.gridDensity,
      y: random() * config.gridDensity,
    },
    annotation: {
      x: 626 + (random() - 0.5) * 44,
      y: 118 + (random() - 0.5) * 28,
      rotate: -4 + (random() - 0.5) * 7,
    },
    highlightIndex: Math.floor(random() * 3),
  }
}
