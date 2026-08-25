/**
 * Varm vektor — generator for presentasjonsgrafikk.
 *
 * Reglene fra research-passet (plans/visual-language-vektor.md) er hardkodet
 * her: bare streker, ingen skjulte linjer, knekkpunktene lyser/pøler, lagene
 * ligger med vilje feil, ingen strek er helt rett. Alt annet er en knapp.
 *
 * Utdata er en ren funksjon av configen — inkludert `seed`. All tilfeldighet
 * kommer fra mulberry32, aldri fra Math.random, slik at en lagret config
 * gjenskaper nøyaktig det bildet den ble lagret fra.
 */

import { flowChartLayout } from "./flow-chart"
import { orgChartLayout } from "./org-chart"

export const visualModes = [
  { id: "terreng", label: "Terreng", hint: "Stablet linjeplott" },
  { id: "rutenett", label: "Rutenett", hint: "Projisert bakkeplan" },
  { id: "legeme", label: "Legeme", hint: "Wireframe uten skjulte linjer" },
  { id: "lissajous", label: "Lissajous", hint: "Oscilloskopets XY-figur" },
  { id: "attraktor", label: "Attraktor", hint: "Lorenz-banen" },
  { id: "organisasjon", label: "Organisasjon", hint: "Advantis agentorg, tegnet med penn" },
  { id: "node", label: "Node", hint: "Én boks som kan morphe mellom to posisjoner" },
  { id: "flyt", label: "Flyt", hint: "Arbeidsløkka, fire ledd og en returbue" },
] as const

export const visualSolids = [
  { id: "torus", label: "Torus" },
  { id: "kube", label: "Kube" },
  { id: "ikosaeder", label: "Ikosaeder" },
  { id: "tesserakt", label: "Tesserakt" },
] as const

export const visualSubstrates = [
  { id: "papir", label: "Papir", hint: "Plotter på varmt papir" },
  { id: "ror", label: "Rør", hint: "Rav-fosfor i mørket" },
  { id: "riso", label: "Riso", hint: "To blekk, ute av register" },
] as const

export type VisualMode = (typeof visualModes)[number]["id"]
export type VisualSolid = (typeof visualSolids)[number]["id"]
export type VisualSubstrate = (typeof visualSubstrates)[number]["id"]

export type DeckVisualConfig = {
  seed: number
  mode: VisualMode
  substrate: VisualSubstrate
  solid: VisualSolid
  density: number
  lineWeight: number
  wobble: number
  backlash: number
  bloom: number
  halo: number
  misregistration: number
  overdraw: number
  perspective: number
  rotation: number
  hatch: number
  hatchAngle: number
  fibre: number
  secondInk: number
  /** Kun motiv «Organisasjon». */
  nodeScale: number
  rankGap: number
}

export const defaultDeckVisual: DeckVisualConfig = {
  seed: 260824,
  mode: "terreng",
  substrate: "papir",
  solid: "torus",
  density: 0.55,
  lineWeight: 1.05,
  wobble: 1.1,
  backlash: 0.9,
  bloom: 0.45,
  halo: 0.35,
  misregistration: 1.4,
  overdraw: 1,
  perspective: 0.6,
  rotation: 34,
  hatch: 0,
  hatchAngle: 45,
  fibre: 0.3,
  secondInk: 0.55,
  nodeScale: 1,
  rankGap: 1,
}

export const VISUAL_WIDTH = 960
export const VISUAL_HEIGHT = 540
/**
 * Org-kartet plasseres inne i lysbilderammen (960×540) i stedet for å ha sin
 * egen. Da lever kartet og den morphende noden i nøyaktig samme koordinater,
 * og CEO-boksen kan vokse ut av kartet uten at noe må måles i nettleseren.
 */
export const ORG_PLACE = { x: 53, y: 122, scale: 0.89 }

/** Én boks, uttrykt i lysbildekoordinater. Alle felt kan interpoleres. */
export type NodeFrame = {
  x: number
  y: number
  w: number
  h: number
  /** Lengden på stubben oppover. 0 = ingen. */
  stub: number
  /** 0 = leverer selv, 1 = full delegeringsvifte under boksen. */
  delegate: number
  /** Opasitet på navnet inni boksen. */
  label: number
  /** Opasitet på hele noden. */
  alpha: number
}

export type RenderOptions = {
  nodeFrame?: NodeFrame
  /** Slå av CEO-boksen i kartet når den morphende noden tegner den i stedet. */
  omitCeoBox?: boolean
}

const FALLBACK_NODE: NodeFrame = {
  x: 60,
  y: 170,
  w: 350,
  h: 200,
  stub: 40,
  delegate: 1,
  label: 1,
  alpha: 1,
}

export type Point = { x: number; y: number }
type Ink = "primary" | "secondary" | "muted"

type RawPath = {
  points: Point[]
  ink: Ink
  smooth?: boolean
  closed?: boolean
  weight?: number
  opacity?: number
  dash?: string
  /** Andel av slark-knappen denne streken skal ha. Diagrammer vil ha lite. */
  wobble?: number
}

export type ScenePath = {
  id: string
  d: string
  ink: Ink
  weight: number
  opacity: number
  dash?: string
}

export type DeckVisualScene = {
  width: number
  height: number
  palette: {
    ground: string
    primary: string
    secondary: string
    muted: string
  }
  blend: "multiply" | "screen"
  /** Regel 7: glorien er halation, ikke neon — svak, bred, varm. */
  glowInk: string
  paths: ScenePath[]
  hatch: ScenePath[]
  /** Regel 3: knekkpunktene lyser (rør) eller pøler (papir). */
  nodes: Array<{ x: number; y: number; r: number; opacity: number }>
  fibres: Array<{ d: string; opacity: number }>
  /** Regel 5: hvert blekklag ligger med vilje litt feil. */
  offsets: Record<Ink, Point>
  overdrawOffsets: Point[]
  /** Regel 10: flere linjer → dimmere bilde. */
  refresh: number
  segments: number
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

const TAU = Math.PI * 2
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smoothstep = (t: number) => t * t * (3 - 2 * t)

/** Verdistøy på et lite gitter — nok til fjellrygger, billig nok til å dra i en slider. */
function makeNoise(random: () => number) {
  const size = 64
  const table = new Float32Array(size * size)
  for (let i = 0; i < table.length; i += 1) table[i] = random()

  return (x: number, y: number) => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const tx = smoothstep(x - x0)
    const ty = smoothstep(y - y0)
    const at = (ix: number, iy: number) =>
      table[(((iy % size) + size) % size) * size + (((ix % size) + size) % size)]
    const top = lerp(at(x0, y0), at(x0 + 1, y0), tx)
    const bottom = lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), tx)
    return lerp(top, bottom, ty)
  }
}

/**
 * Regel 6: overskyting i retningsskiftene. Plotterens slark bærer pennen et
 * hakk forbi hjørnet før den snur.
 */
function applyBacklash(points: Point[], amount: number) {
  if (amount <= 0.01 || points.length < 3) return points
  const out: Point[] = [points[0]]

  for (let i = 1; i < points.length - 1; i += 1) {
    const previous = points[i - 1]
    const current = points[i]
    const next = points[i + 1]
    const inX = current.x - previous.x
    const inY = current.y - previous.y
    const outX = next.x - current.x
    const outY = next.y - current.y
    const inLength = Math.hypot(inX, inY) || 1
    const outLength = Math.hypot(outX, outY) || 1
    const dot = (inX * outX + inY * outY) / (inLength * outLength)
    const turn = Math.acos(clamp(dot, -1, 1))

    if (turn > 0.5) {
      const overshoot = amount * (0.5 + turn / Math.PI)
      out.push({
        x: current.x + (inX / inLength) * overshoot,
        y: current.y + (inY / inLength) * overshoot,
      })
    }
    out.push(current)
  }

  out.push(points[points.length - 1])
  return out
}

/**
 * Regel 6: ingen strek er rett. Punktstøy (Molnárs 1 % uorden) pluss en langsom
 * drift som leser som papir eller karriasje som sklir.
 */
function applyWobble(points: Point[], amount: number, random: () => number) {
  if (amount <= 0.01) return points
  const phaseX = random() * TAU
  const phaseY = random() * TAU
  const freq = 0.6 + random() * 1.9
  const last = Math.max(1, points.length - 1)

  return points.map((point, index) => {
    const t = index / last
    return {
      x:
        point.x +
        (random() - 0.5) * amount +
        Math.sin(phaseX + t * freq * TAU) * amount * 0.6,
      y:
        point.y +
        (random() - 0.5) * amount +
        Math.cos(phaseY + t * freq * TAU) * amount * 0.6,
    }
  })
}

const round = (value: number) => Math.round(value * 10) / 10

function toPath(points: Point[], smooth: boolean) {
  if (points.length === 0) return ""
  if (points.length < 3 || !smooth) {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
      .join(" ")
  }

  let d = `M${round(points[0].x)} ${round(points[0].y)}`
  for (let i = 1; i < points.length - 1; i += 1) {
    const current = points[i]
    const next = points[i + 1]
    d += ` Q${round(current.x)} ${round(current.y)} ${round(
      (current.x + next.x) / 2,
    )} ${round((current.y + next.y) / 2)}`
  }
  const end = points[points.length - 1]
  return `${d} L${round(end.x)} ${round(end.y)}`
}

/** Knekkpunkter: de skarpeste retningsskiftene, ikke hvert eneste punkt. */
function collectNodes(points: Point[], into: Point[]) {
  for (let i = 1; i < points.length - 1; i += 1) {
    const previous = points[i - 1]
    const current = points[i]
    const next = points[i + 1]
    const inX = current.x - previous.x
    const inY = current.y - previous.y
    const outX = next.x - current.x
    const outY = next.y - current.y
    const inLength = Math.hypot(inX, inY)
    const outLength = Math.hypot(outX, outY)
    if (inLength < 0.6 || outLength < 0.6) continue
    const dot = (inX * outX + inY * outY) / (inLength * outLength)
    if (Math.acos(clamp(dot, -1, 1)) > 0.42) into.push(current)
  }
}

/* ------------------------------------------------------------------ moduser */

export type Geometry = { paths: RawPath[]; nodes?: Point[] }

/**
 * Skaler et motiv uniformt inn i rammen. Uten dette vokser og krymper
 * legemene når man drar i rotasjonen, og tesserakten renner ut av bildet.
 */
function fitGeometry(geometry: Geometry, fillX: number, fillY: number): Geometry {
  const all = [...geometry.paths.flatMap((path) => path.points), ...(geometry.nodes ?? [])]
  if (all.length === 0) return geometry

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const point of all) {
    if (point.x < minX) minX = point.x
    if (point.x > maxX) maxX = point.x
    if (point.y < minY) minY = point.y
    if (point.y > maxY) maxY = point.y
  }

  const width = Math.max(1e-3, maxX - minX)
  const height = Math.max(1e-3, maxY - minY)
  const scale = Math.min(
    (VISUAL_WIDTH * fillX) / width,
    (VISUAL_HEIGHT * fillY) / height,
  )
  const centreX = (minX + maxX) / 2
  const centreY = (minY + maxY) / 2
  const map = (point: Point): Point => ({
    x: VISUAL_WIDTH / 2 + (point.x - centreX) * scale,
    y: VISUAL_HEIGHT / 2 + (point.y - centreY) * scale,
  })

  return {
    paths: geometry.paths.map((path) => ({ ...path, points: path.points.map(map) })),
    nodes: geometry.nodes?.map(map),
  }
}

function buildTerreng(config: DeckVisualConfig, random: () => number): Geometry {
  const noise = makeNoise(random)
  // Ridget støy: `1 - |2n-1|` snur mykt kupert til skarpe rygger — det er
  // formen tidlig terrengplott faktisk hadde.
  const ridge = (x: number, y: number) => 1 - Math.abs(noise(x, y) * 2 - 1)
  const field = (u: number, v: number) =>
    Math.pow(
      ridge(u * 3.1 + 11, v * 0.34) * 0.55 +
        ridge(u * 7.3 + 5, v * 0.61) * 0.29 +
        ridge(u * 15.7, v * 1.15) * 0.16,
      1.35,
    )

  const rows = Math.round(8 + config.density * 20)
  const cols = Math.round(34 + config.density * 62)
  const horizon = VISUAL_HEIGHT * 0.19
  const paths: RawPath[] = []
  const grid: Point[][] = []

  for (let r = 0; r < rows; r += 1) {
    const t = rows === 1 ? 1 : r / (rows - 1)
    // Fjerne rader klumper seg mot horisonten; perspektivknappen styrer hvor hardt.
    const eased = Math.pow(t, 1 + config.perspective * 1.9)
    const base = lerp(horizon + 22, VISUAL_HEIGHT * 1.02, eased)
    const spread = lerp(0.5, 1.5, t) * (0.8 + config.perspective * 0.45)
    const amplitude = lerp(14, 132, t) * (0.45 + config.density * 0.7)
    const row: Point[] = []

    for (let c = 0; c < cols; c += 1) {
      const u = cols === 1 ? 0.5 : c / (cols - 1)
      row.push({
        x: VISUAL_WIDTH / 2 + (u - 0.5) * VISUAL_WIDTH * spread,
        y: base - field(u, r * 0.5) * amplitude,
      })
    }

    grid.push(row)
    // Regel 1 og 2: rette segmenter, ingen utjevning, ingenting skjult bak.
    paths.push({ points: row, ink: "primary", opacity: lerp(0.34, 1, t) })
  }

  // Ribbene gjør plottet til et gitter — uten dem er det bare stablede kurver.
  const ribStep = Math.max(2, Math.round(cols / (7 + config.density * 16)))
  for (let c = 0; c < cols; c += ribStep) {
    const rib = grid.map((row) => row[c])
    paths.push({ points: rib, ink: "primary", weight: 0.72, opacity: 0.5 })
  }

  paths.push({
    points: [
      { x: -20, y: horizon },
      { x: VISUAL_WIDTH / 2, y: horizon },
      { x: VISUAL_WIDTH + 20, y: horizon },
    ],
    ink: "muted",
    weight: 0.7,
    opacity: 0.55,
  })

  return { paths }
}

function buildRutenett(config: DeckVisualConfig): Geometry {
  const horizon = VISUAL_HEIGHT * (0.24 + 0.2 * (1 - config.perspective))
  const vanishing = { x: VISUAL_WIDTH / 2, y: horizon }
  const columns = Math.round(9 + config.density * 25)
  const rows = Math.round(7 + config.density * 17)
  const paths: RawPath[] = []
  const bottomSpan = VISUAL_WIDTH * (1.6 + config.perspective * 2.1)

  for (let c = 0; c <= columns; c += 1) {
    const u = c / columns
    const bottomX = VISUAL_WIDTH / 2 + (u - 0.5) * bottomSpan
    const points: Point[] = []
    for (let s = 0; s <= 10; s += 1) {
      const k = s / 10
      points.push({
        x: lerp(bottomX, vanishing.x, k),
        y: lerp(VISUAL_HEIGHT + 24, vanishing.y + 2, k),
      })
    }
    paths.push({ points, ink: "primary", opacity: 0.34 + (1 - u) * 0 + 0.5 })
  }

  for (let r = 1; r <= rows; r += 1) {
    const k = r / rows
    // Eksponentiell avstand: linjene hoper seg opp mot horisonten.
    const depth = Math.pow(k, 2.6 - config.perspective * 1.2)
    const y = lerp(vanishing.y, VISUAL_HEIGHT + 24, depth)
    const halfSpan = (bottomSpan / 2) * depth
    const points: Point[] = []
    for (let s = 0; s <= 14; s += 1) {
      const u = s / 14
      points.push({ x: vanishing.x + (u - 0.5) * 2 * halfSpan, y })
    }
    paths.push({ points, ink: "primary", opacity: 0.3 + depth * 0.7 })
  }

  paths.push({
    points: [
      { x: -20, y: horizon },
      { x: VISUAL_WIDTH / 2, y: horizon },
      { x: VISUAL_WIDTH + 20, y: horizon },
    ],
    ink: "secondary",
    weight: 1.3,
    opacity: 0.9,
  })

  return { paths }
}

type Vec3 = { x: number; y: number; z: number }

function solidGeometry(
  config: DeckVisualConfig,
): { loops: Vec3[][]; edges: Array<[Vec3, Vec3]> } {
  const loops: Vec3[][] = []
  const edges: Array<[Vec3, Vec3]> = []

  if (config.solid === "torus") {
    const major = Math.round(8 + config.density * 16)
    const minor = Math.round(6 + config.density * 10)
    const R = 1
    const r = 0.42
    const at = (u: number, v: number): Vec3 => ({
      x: (R + r * Math.cos(v)) * Math.cos(u),
      y: r * Math.sin(v),
      z: (R + r * Math.cos(v)) * Math.sin(u),
    })
    for (let i = 0; i < major; i += 1) {
      const u = (i / major) * TAU
      const loop: Vec3[] = []
      for (let j = 0; j <= minor; j += 1) loop.push(at(u, (j / minor) * TAU))
      loops.push(loop)
    }
    for (let j = 0; j < minor; j += 1) {
      const v = (j / minor) * TAU
      const loop: Vec3[] = []
      for (let i = 0; i <= major; i += 1) loop.push(at((i / major) * TAU, v))
      loops.push(loop)
    }
    return { loops, edges }
  }

  if (config.solid === "kube") {
    const v: Vec3[] = []
    for (const x of [-1, 1])
      for (const y of [-1, 1]) for (const z of [-1, 1]) v.push({ x, y, z })
    const pairs: Array<[number, number]> = [
      [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3],
      [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7],
    ]
    for (const [a, b] of pairs) edges.push([v[a], v[b]])
    return { loops, edges }
  }

  if (config.solid === "ikosaeder") {
    const p = (1 + Math.sqrt(5)) / 2
    const raw: Array<[number, number, number]> = [
      [-1, p, 0], [1, p, 0], [-1, -p, 0], [1, -p, 0],
      [0, -1, p], [0, 1, p], [0, -1, -p], [0, 1, -p],
      [p, 0, -1], [p, 0, 1], [-p, 0, -1], [-p, 0, 1],
    ]
    const v = raw.map(([x, y, z]) => ({ x: x / p, y: y / p, z: z / p }))
    const pairs: Array<[number, number]> = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10], [1, 5], [5, 11], [11, 10],
      [10, 7], [7, 1], [3, 9], [3, 4], [3, 2], [3, 6], [3, 8], [4, 9], [9, 8],
      [8, 6], [6, 2], [2, 4], [5, 9], [11, 4], [10, 2], [7, 6], [1, 8], [4, 11],
      [2, 10], [6, 7], [8, 1], [9, 5],
    ]
    for (const [a, b] of pairs) edges.push([v[a], v[b]])
    return { loops, edges }
  }

  // Tesserakt: 16 hjørner i 4D, projisert 4D → 3D før den vanlige projeksjonen.
  const angle = (config.rotation * Math.PI) / 180
  const cells: Vec3[] = []
  for (let i = 0; i < 16; i += 1) {
    const x = i & 1 ? 1 : -1
    const y = i & 2 ? 1 : -1
    const z = i & 4 ? 1 : -1
    const w = i & 8 ? 1 : -1
    const xr = x * Math.cos(angle) - w * Math.sin(angle)
    const wr = x * Math.sin(angle) + w * Math.cos(angle)
    const k = 2.6 / (2.6 - wr * 0.72)
    cells.push({ x: xr * k * 0.78, y: y * k * 0.78, z: z * k * 0.78 })
  }
  for (let i = 0; i < 16; i += 1) {
    for (const bit of [1, 2, 4, 8]) {
      const j = i ^ bit
      if (j > i) edges.push([cells[i], cells[j]])
    }
  }
  return { loops, edges }
}

function buildLegeme(config: DeckVisualConfig, random: () => number): Geometry {
  const { loops, edges } = solidGeometry(config)
  const angle = (config.rotation * Math.PI) / 180
  const tilt = 0.28 + random() * 0.5
  const focal = lerp(9, 2.3, config.perspective)
  const scale = VISUAL_HEIGHT * 0.34
  const centre = { x: VISUAL_WIDTH / 2, y: VISUAL_HEIGHT / 2 }

  const project = (v: Vec3): Point => {
    const cosY = Math.cos(angle)
    const sinY = Math.sin(angle)
    const x1 = v.x * cosY - v.z * sinY
    const z1 = v.x * sinY + v.z * cosY
    const cosX = Math.cos(tilt)
    const sinX = Math.sin(tilt)
    const y1 = v.y * cosX - z1 * sinX
    const z2 = v.y * sinX + z1 * cosX
    const k = focal / (focal + z2)
    return { x: centre.x + x1 * scale * k, y: centre.y + y1 * scale * k }
  }

  // Regel 2: ingen hidden-line removal — baksiden tegnes like fullt.
  const paths: RawPath[] = [
    ...loops.map((loop) => ({
      points: loop.map(project),
      ink: "primary" as const,
      smooth: true,
      opacity: 0.85,
    })),
    ...edges.map(([a, b]) => ({
      points: [project(a), project(b)],
      ink: "primary" as const,
      opacity: 0.9,
    })),
  ]

  const nodes: Point[] = [
    ...edges.flatMap(([a, b]) => [project(a), project(b)]),
    ...loops.flatMap((loop) => loop.filter((_, i) => i % 3 === 0).map(project)),
  ]

  return fitGeometry({ paths, nodes }, 0.74, 0.82)
}

function buildLissajous(config: DeckVisualConfig, random: () => number): Geometry {
  const ratios: Array<[number, number]> = [
    [3, 2], [5, 4], [3, 4], [5, 3], [7, 5], [4, 3], [7, 4],
  ]
  const [a, b] = ratios[Math.floor(random() * ratios.length)]
  const delta = (config.rotation * Math.PI) / 180
  const steps = Math.round(280 + config.density * 820)
  const ampX = VISUAL_WIDTH * (0.3 + config.perspective * 0.08)
  const ampY = VISUAL_HEIGHT * (0.33 + config.perspective * 0.06)
  const figure = (phase: number) => {
    const points: Point[] = []
    for (let i = 0; i <= steps; i += 1) {
      const t = (i / steps) * TAU
      points.push({
        x: VISUAL_WIDTH / 2 + ampX * Math.sin(a * t + delta + phase),
        y: VISUAL_HEIGHT / 2 + ampY * Math.sin(b * t),
      })
    }
    return points
  }

  return {
    paths: [
      { points: figure(0), ink: "primary", smooth: true, opacity: 1 },
      // Oscilloskopet driver: en andre figur som ikke helt har innhentet den første.
      { points: figure(0.06 + random() * 0.05), ink: "secondary", smooth: true, opacity: 0.75 },
    ],
  }
}

function buildAttraktor(config: DeckVisualConfig, random: () => number): Geometry {
  const steps = Math.round(2200 + config.density * 4200)
  const dt = 0.0058
  const sigma = 10
  const rho = 28
  const beta = 8 / 3
  const angle = (config.rotation * Math.PI) / 180
  const scale = 9.4 * (0.85 + config.perspective * 0.3)

  let x = 0.1 + random() * 1.4
  let y = 0.4 + random() * 1.2
  let z = 10 + random() * 8
  for (let i = 0; i < 260; i += 1) {
    const dx = sigma * (y - x)
    const dy = x * (rho - z) - y
    const dz = x * y - beta * z
    x += dx * dt
    y += dy * dt
    z += dz * dt
  }

  const points: Point[] = []
  for (let i = 0; i < steps; i += 1) {
    const dx = sigma * (y - x)
    const dy = x * (rho - z) - y
    const dz = x * y - beta * z
    x += dx * dt
    y += dy * dt
    z += dz * dt
    const rx = x * Math.cos(angle) - y * Math.sin(angle)
    points.push({
      x: VISUAL_WIDTH / 2 + rx * scale,
      y: VISUAL_HEIGHT * 0.96 - z * scale * 0.82,
    })
  }

  return fitGeometry(
    { paths: [{ points, ink: "primary", smooth: true, opacity: 0.92 }] },
    0.62 + config.perspective * 0.2,
    0.74 + config.perspective * 0.14,
  )
}

/**
 * Del opp rette strekk i mange punkter. Uten dette vipper hele linjen når
 * slarken flytter endepunktene hver sin vei — og et org-kart som heller er
 * feil. Med det skjelver streken langs seg selv og blir stående loddrett.
 */
function resample(points: Point[], step: number): Point[] {
  const out: Point[] = [points[0]]
  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1]
    const to = points[i]
    const length = Math.hypot(to.x - from.x, to.y - from.y)
    const parts = Math.max(1, Math.round(length / step))
    for (let k = 1; k <= parts; k += 1) {
      out.push({
        x: from.x + ((to.x - from.x) * k) / parts,
        y: from.y + ((to.y - from.y) * k) / parts,
      })
    }
  }
  return out
}

function buildOrgChart(config: DeckVisualConfig, omitCeoBox: boolean): Geometry {
  const layout = orgChartLayout(config)
  const boxes = omitCeoBox
    ? layout.boxes.filter((box) => box.id !== "ceo")
    : layout.boxes
  return {
    paths: [
      ...boxes.map((box) => ({
        points: resample(
          [
            { x: box.x, y: box.y },
            { x: box.x + box.w, y: box.y },
            { x: box.x + box.w, y: box.y + box.h },
            { x: box.x, y: box.y + box.h },
            { x: box.x, y: box.y },
          ],
          16,
        ),
        ink: "primary" as const,
        // Boksen er beholderen, navnet er innholdet — beholderen skal vike.
        weight: box.size === "chip" ? 0.64 : box.size === "unit" ? 0.82 : box.size === "brain" ? 1.15 : 1,
        opacity: box.size === "chip" ? 0.6 : box.size === "unit" ? 0.9 : 1,

      })),
      ...layout.edges.map((edge) => ({
        points: resample(edge.points, 14),
        ink: "primary" as const,
        weight: edge.ghost ? 0.66 : 0.85,
        opacity: edge.ghost ? 0.5 : 0.85,
        dash: edge.ghost ? "4 4" : undefined,
      })),
    ],
    // Portene er der pennen settes ned — de skal pøle, ikke gjettes fram.
    nodes: layout.ports,
  }
}

function buildFlowChart(config: DeckVisualConfig): Geometry {
  const layout = flowChartLayout(config)
  return {
    paths: [
      ...layout.boxes.map((box) => ({
        points: resample(
          [
            { x: box.x, y: box.y },
            { x: box.x + box.w, y: box.y },
            { x: box.x + box.w, y: box.y + box.h },
            { x: box.x, y: box.y + box.h },
            { x: box.x, y: box.y },
          ],
          16,
        ),
        ink: "primary" as const,
      })),
      ...layout.edges.map((edge) => ({
        points: resample(edge.points, 14),
        ink: "primary" as const,
        weight: 0.85,
        opacity: 0.9,
      })),
    ],
    nodes: layout.ports,
  }
}

/**
 * Én boks med kabelstubbene fortsatt hengende i endene. Fordi hele formen er
 * en funksjon av `frame`, kan den interpoleres fra CEO-boksen i org-kartet til
 * nærbildet uten at noe strekkes eller byttes ut underveis.
 */
function buildNode(frame: NodeFrame): Geometry {
  const centre = frame.x + frame.w / 2
  const bottom = frame.y + frame.h

  const paths: RawPath[] = [
    {
      points: resample(
        [
          { x: frame.x, y: frame.y },
          { x: frame.x + frame.w, y: frame.y },
          { x: frame.x + frame.w, y: bottom },
          { x: frame.x, y: bottom },
          { x: frame.x, y: frame.y },
        ],
        16,
      ),
      ink: "primary",
      opacity: frame.alpha,
    },
  ]

  const ports: Point[] = []

  if (frame.stub > 1) {
    paths.push({
      points: resample([{ x: centre, y: frame.y - frame.stub }, { x: centre, y: frame.y }], 14),
      ink: "primary",
      weight: 0.85,
      opacity: frame.alpha,
    })
    ports.push({ x: centre, y: frame.y })
  }

  // Delegeringsviften vokser ut av boksen i stedet for å dukke opp ferdig.
  if (frame.delegate > 0.02) {
    const drop = 34 * frame.delegate
    const busY = bottom + drop
    const reach = (frame.w / 2 - 34) * frame.delegate
    const first = centre - reach
    const last = centre + reach
    paths.push(
      {
        points: resample([{ x: centre, y: bottom }, { x: centre, y: busY }], 14),
        ink: "primary",
        weight: 0.85,
        opacity: frame.alpha * frame.delegate,
      },
      {
        points: resample([{ x: first, y: busY }, { x: centre, y: busY }, { x: last, y: busY }], 14),
        ink: "primary",
        weight: 0.85,
        opacity: frame.alpha * frame.delegate,
      },
    )
    for (const x of [first, centre, last]) {
      paths.push({
        points: resample([{ x, y: busY }, { x, y: busY + 30 * frame.delegate }], 14),
        ink: "primary",
        weight: 0.8,
        opacity: frame.alpha * frame.delegate,
      })
      ports.push({ x, y: busY })
    }
  }

  return { paths, nodes: ports }
}

/* ------------------------------------------------------------------- render */

export const visualPalettes: Record<
  VisualSubstrate,
  DeckVisualScene["palette"] & {
    blend: DeckVisualScene["blend"]
    glow: string
  }
> = {
  papir: {
    ground: "#f5f2ea",
    primary: "#26231c",
    secondary: "#a0563a",
    muted: "#b9b1a0",
    blend: "multiply",
    glow: "#a0563a",
  },
  ror: {
    ground: "#14100c",
    primary: "#ffb257",
    secondary: "#ff542d",
    muted: "#6d4b2b",
    blend: "screen",
    glow: "#ff8a2b",
  },
  riso: {
    ground: "#ece2cc",
    primary: "#ff4a17",
    secondary: "#26364f",
    muted: "#b4a68e",
    blend: "multiply",
    glow: "#ff4a17",
  },
}

export function renderDeckVisual(
  config: DeckVisualConfig,
  options: RenderOptions = {},
): DeckVisualScene {
  const random = mulberry32(config.seed)
  const palette = visualPalettes[config.substrate]
  const height = VISUAL_HEIGHT

  const geometry =
    config.mode === "terreng"
      ? buildTerreng(config, random)
      : config.mode === "rutenett"
        ? buildRutenett(config)
        : config.mode === "legeme"
          ? buildLegeme(config, random)
          : config.mode === "lissajous"
            ? buildLissajous(config, random)
            : config.mode === "attraktor"
              ? buildAttraktor(config, random)
              : config.mode === "organisasjon"
                ? buildOrgChart(config, options.omitCeoBox === true)
                : config.mode === "flyt"
                  ? buildFlowChart(config)
                  : buildNode(options.nodeFrame ?? FALLBACK_NODE)

  const nodeCandidates: Point[] = [...(geometry.nodes ?? [])]
  const paths: ScenePath[] = []
  let segments = 0

  geometry.paths.forEach((raw, index) => {
    const closed = raw.closed ? [...raw.points, raw.points[0]] : raw.points
    const withBacklash = applyBacklash(closed, config.backlash)
    const finished = applyWobble(
      withBacklash,
      config.wobble * (raw.wobble ?? 1),
      random,
    )
    segments += Math.max(0, finished.length - 1)
    if (!geometry.nodes) collectNodes(finished, nodeCandidates)
    paths.push({
      id: `p${index}`,
      d: toPath(finished, raw.smooth ?? false),
      ink: raw.ink,
      weight: config.lineWeight * (raw.weight ?? 1),
      opacity: raw.opacity ?? 1,
      dash: raw.dash,
    })
  })

  // Regel 4: andreblekket er ikke en ny tegning, det er samme tegning trykt
  // en gang til og litt ved siden av.
  if (config.secondInk > 0.02) {
    const ghosts = paths.filter((path) => path.ink === "primary")
    for (const ghost of ghosts) {
      paths.push({
        id: `${ghost.id}-ghost`,
        d: ghost.d,
        ink: "secondary",
        weight: ghost.weight * 0.8,
        opacity: ghost.opacity * config.secondInk * 0.7,
        dash: ghost.dash,
      })
    }
  }

  // Regel 1: skravur er den eneste måten en penn kan lage flate på.
  const hatch: ScenePath[] = []
  if (config.hatch > 0.02) {
    const lines = Math.round(config.hatch * 64)
    const diagonal = Math.hypot(VISUAL_WIDTH, VISUAL_HEIGHT)
    const angles =
      config.hatch > 0.55
        ? [config.hatchAngle, config.hatchAngle + 90]
        : [config.hatchAngle]
    angles.forEach((degrees, set) => {
      const theta = (degrees * Math.PI) / 180
      const dx = Math.cos(theta)
      const dy = Math.sin(theta)
      for (let i = 0; i < lines; i += 1) {
        const offset = ((i + 0.5) / lines - 0.5) * diagonal * 1.25
        const cx = VISUAL_WIDTH / 2 - dy * offset
        const cy = VISUAL_HEIGHT / 2 + dx * offset
        const half = diagonal * 0.62
        const points = applyWobble(
          [
            { x: cx - dx * half, y: cy - dy * half },
            { x: cx, y: cy },
            { x: cx + dx * half, y: cy + dy * half },
          ],
          config.wobble * 0.8,
          random,
        )
        hatch.push({
          id: `h${set}-${i}`,
          d: toPath(points, false),
          ink: "muted",
          weight: config.lineWeight * 0.55,
          opacity: 0.16 + config.hatch * 0.2,
        })
      }
    })
  }

  // Regel 3 — men doser den: alle knekkpunkter blir grøt, de skarpeste blir stil.
  const maxNodes = 160
  const step = Math.max(1, Math.ceil(nodeCandidates.length / maxNodes))
  const nodes = nodeCandidates
    .filter((_, index) => index % step === 0)
    .map((point) => ({
      x: round(point.x),
      y: round(point.y),
      r: 0.5 + config.bloom * (2.1 + config.lineWeight * 0.6),
      opacity: 0.22 + config.bloom * 0.68,
    }))

  const fibreCount = Math.round(config.fibre * 240)
  const fibres = Array.from({ length: fibreCount }, () => {
    const x = random() * VISUAL_WIDTH
    const y = random() * height
    const theta = random() * TAU
    const length = 0.8 + random() * 3.2
    return {
      d: `M${round(x)} ${round(y)} L${round(x + Math.cos(theta) * length)} ${round(
        y + Math.sin(theta) * length,
      )}`,
      opacity: (0.05 + random() * 0.14) * config.fibre,
    }
  })

  const shift = config.misregistration
  const offsets: Record<Ink, Point> = {
    primary: { x: 0, y: 0 },
    secondary: {
      x: round((random() - 0.5) * 2 * shift),
      y: round((random() - 0.5) * 2 * shift),
    },
    muted: {
      x: round((random() - 0.5) * 1.6 * shift),
      y: round((random() - 0.5) * 1.6 * shift),
    },
  }

  const overdrawOffsets = Array.from(
    { length: Math.max(1, Math.round(config.overdraw)) },
    (_, index) =>
      index === 0
        ? { x: 0, y: 0 }
        : {
            x: round((random() - 0.5) * 1.5),
            y: round((random() - 0.5) * 1.5),
          },
  )

  return {
    width: VISUAL_WIDTH,
    height,
    palette: {
      ground: palette.ground,
      primary: palette.primary,
      secondary: palette.secondary,
      muted: palette.muted,
    },
    blend: palette.blend,
    glowInk: palette.glow,
    paths,
    hatch,
    nodes,
    fibres,
    offsets,
    overdrawOffsets,
    refresh: clamp(1 - segments / 26000, 0.62, 1),
    segments,
  }
}
