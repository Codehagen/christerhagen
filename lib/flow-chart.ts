/**
 * Arbeidsløkka: fire ledd og en returbue.
 *
 * Buen tilbake er hele poenget. En pipeline stopper; en løkke betaler tilbake,
 * og det er utbetalingen som gjør at noen gidder å skrive inn i første ledd.
 */

export type FlowPoint = { x: number; y: number }

export type FlowBox = {
  id: string
  x: number
  y: number
  w: number
  h: number
  step: string
  title: string
  note: string[]
}

export type FlowLayout = {
  boxes: FlowBox[]
  edges: Array<{ points: FlowPoint[]; ghost?: boolean }>
  ports: FlowPoint[]
  /** Etiketten på returbuen. */
  loopLabel: { x: number; y: number }
}

const W = 960
const MARGIN = 34

const steps = [
  {
    id: "inn",
    step: "01",
    title: "Du skriver",
    note: ["Fem setninger etter", "en telefon. Ingen mal."],
  },
  {
    id: "struktur",
    step: "02",
    title: "Den sorterer",
    note: ["Finner personen,", "selskapet, neste steg."],
  },
  {
    id: "hylle",
    step: "03",
    title: "Den lagrer",
    note: ["Ett fast sted.", "Kilde på alt."],
  },
  {
    id: "brief",
    step: "04",
    title: "Du får det igjen",
    note: ["Neste morgen, lest", "opp for deg."],
  },
]

export function flowChartLayout({ nodeScale }: { nodeScale: number }): FlowLayout {
  const s = nodeScale
  const span = W - MARGIN * 2
  const w = 196 * s
  const gap = (span - steps.length * w) / (steps.length - 1)
  const h = 132 * s
  const y = 40

  const x = (i: number) => MARGIN + i * (w + gap)
  const centre = (i: number) => x(i) + w / 2
  const midY = y + h / 2
  const returnY = y + h + 78

  const boxes: FlowBox[] = steps.map((step, i) => ({
    id: step.id,
    x: x(i),
    y,
    w,
    h,
    step: step.step,
    title: step.title,
    note: step.note,
  }))

  const edges: FlowLayout["edges"] = [
    ...steps.slice(0, -1).map((_, i) => ({
      points: [
        { x: x(i) + w, y: midY },
        { x: x(i + 1), y: midY },
      ],
    })),
    // Returbuen, tegnet ortogonalt som resten.
    {
      points: [
        { x: centre(steps.length - 1), y: y + h },
        { x: centre(steps.length - 1), y: returnY },
        { x: centre(0), y: returnY },
        { x: centre(0), y: y + h },
      ],
    },
  ]

  const ports: FlowPoint[] = [
    ...steps.slice(0, -1).flatMap((_, i) => [
      { x: x(i) + w, y: midY },
      { x: x(i + 1), y: midY },
    ]),
    { x: centre(steps.length - 1), y: y + h },
    { x: centre(0), y: y + h },
  ]

  return { boxes, edges, ports, loopLabel: { x: W / 2, y: returnY } }
}
