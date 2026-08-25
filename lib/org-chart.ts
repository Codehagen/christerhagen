/**
 * Advanti Estates agentorganisasjon slik den faktisk står i dag.
 *
 * Kilden er `lib/ai-agents.ts` i Advanti-CRM — samme hierarki, samme roller.
 * Modellnavn er bevisst utelatt: de er konkurransesensitive og de eldes fort.
 *
 * Layouten er ren og uten tilfeldighet. Håndskriften kommer etterpå, når
 * `deck-visual` kjører boksene og kantene gjennom samme penn som resten av
 * presentasjonen.
 */

export type OrgPoint = { x: number; y: number }

export type OrgBoxSize = "team" | "hub" | "daemon" | "unit" | "chip" | "brain"

export type OrgBox = {
  id: string
  x: number
  y: number
  w: number
  h: number
  name: string
  role: string
  size: OrgBoxSize
  ghost?: boolean
}

export type OrgEdge = { points: OrgPoint[]; ghost?: boolean }

export type OrgLayout = {
  boxes: OrgBox[]
  edges: OrgEdge[]
  ports: OrgPoint[]
}

export type OrgLayoutInput = { nodeScale: number; rankGap: number }

const W = 960
const MARGIN = 40
const CENTRE = W / 2

/** Rad 2. CMO ligger i midten med vilje — avdelingen under henger rett ned. */
const units = [
  { id: "kent", name: "Kent", role: "analyse" },
  { id: "cto", name: "Advanti CTO", role: "kode" },
  { id: "cmo", name: "Advanti CMO", role: "marked" },
  { id: "dok", name: "Advanti Dok", role: "dokumenter" },
  { id: "salg", name: "Advanti Salg", role: "salg" },
]

const CMO_INDEX = 2

const cmoTeam = ["Blog Writer", "Buzz", "Strategist", "News Curator", "Digest"]

export function orgChartLayout({ nodeScale, rankGap }: OrgLayoutInput): OrgLayout {
  const s = nodeScale
  const g = rankGap

  const teamH = 32 * s
  const hubH = 44 * s
  const unitH = 54 * s
  const chipH = 26 * s
  const brainH = 36 * s

  const teamY = 4
  const hubY = teamY + teamH + 26 * g
  const busA = hubY + hubH + 22 * g
  const unitY = busA + 20 * g
  const busB = unitY + unitH + 26 * g
  const chipY = busB + 18 * g
  const brainY = chipY + chipH + 34 * g

  const teamW = 300 * s
  const hubW = 264 * s
  const daemonW = 150 * s
  const daemonH = 28 * s

  const span = W - MARGIN * 2
  const unitW = 160 * s
  const unitGap = (span - units.length * unitW) / (units.length - 1)
  const unitX = (i: number) => MARGIN + i * (unitW + unitGap)
  const unitCentre = (i: number) => unitX(i) + unitW / 2

  const chipSpan = span - 60
  const chipW = 140 * s
  const chipGap = (chipSpan - cmoTeam.length * chipW) / (cmoTeam.length - 1)
  const chipX = (i: number) => MARGIN + 30 + i * (chipW + chipGap)
  const chipCentre = (i: number) => chipX(i) + chipW / 2

  const daemonX = W - MARGIN - daemonW
  const daemonMidY = hubY + hubH / 2

  const boxes: OrgBox[] = [
    {
      id: "team",
      x: CENTRE - teamW / 2,
      y: teamY,
      w: teamW,
      h: teamH,
      size: "team",
      name: "Meglerne",
      role: "menneskene",
    },
    {
      id: "viktor",
      x: CENTRE - hubW / 2,
      y: hubY,
      w: hubW,
      h: hubH,
      size: "hub",
      name: "Viktor",
      role: "chief of staff · alltid på",
    },
    {
      id: "wintermute",
      x: daemonX,
      y: daemonMidY - daemonH / 2,
      w: daemonW,
      h: daemonH,
      size: "daemon",
      name: "Wintermute",
      role: "bakgrunn",
    },
    ...units.map((unit, i) => ({
      id: unit.id,
      x: unitX(i),
      y: unitY,
      w: unitW,
      h: unitH,
      size: "unit" as const,
      name: unit.name,
      role: unit.role,
    })),
    ...cmoTeam.map((name, i) => ({
      id: `cmo-${i}`,
      x: chipX(i),
      y: chipY,
      w: chipW,
      h: chipH,
      size: "chip" as const,
      name,
      role: "",
    })),
    {
      id: "brain",
      x: MARGIN,
      y: brainY,
      w: span,
      h: brainH,
      size: "brain",
      name: "Company brain",
      role: "alle skriver hit · alle leser herfra",
    },
  ]

  // Ortogonal kabling: bare rette vinkler, som et org-kart tegnet på en plotter.
  const edges: OrgEdge[] = [
    { points: [{ x: CENTRE, y: teamY + teamH }, { x: CENTRE, y: hubY }] },
    {
      points: [
        { x: CENTRE + hubW / 2, y: daemonMidY },
        { x: daemonX, y: daemonMidY },
      ],
    },
    { points: [{ x: CENTRE, y: hubY + hubH }, { x: CENTRE, y: busA }] },
    {
      points: [
        { x: unitCentre(0), y: busA },
        { x: CENTRE, y: busA },
        { x: unitCentre(units.length - 1), y: busA },
      ],
    },
    ...units.map((_, i) => ({
      points: [
        { x: unitCentre(i), y: busA },
        { x: unitCentre(i), y: unitY },
      ],
    })),
    // CMO har sin egen avdeling. Den henger rett ned fra midten.
    {
      points: [
        { x: unitCentre(CMO_INDEX), y: unitY + unitH },
        { x: unitCentre(CMO_INDEX), y: busB },
      ],
    },
    {
      points: [
        { x: chipCentre(0), y: busB },
        { x: CENTRE, y: busB },
        { x: chipCentre(cmoTeam.length - 1), y: busB },
      ],
    },
    ...cmoTeam.map((_, i) => ({
      points: [
        { x: chipCentre(i), y: busB },
        { x: chipCentre(i), y: chipY },
      ],
    })),
    // Hjernen ligger under alt. Stiplet, fordi den er et lag og ikke en ansatt.
    ...[unitCentre(0), CENTRE, unitCentre(units.length - 1)].map((x) => ({
      points: [
        { x, y: chipY + chipH },
        { x, y: brainY },
      ],
      ghost: true,
    })),
  ]

  const ports: OrgPoint[] = [
    { x: CENTRE, y: teamY + teamH },
    { x: CENTRE, y: hubY },
    { x: CENTRE, y: hubY + hubH },
    { x: CENTRE, y: busA },
    ...units.map((_, i) => ({ x: unitCentre(i), y: busA })),
    ...units.map((_, i) => ({ x: unitCentre(i), y: unitY })),
    { x: unitCentre(CMO_INDEX), y: unitY + unitH },
    { x: unitCentre(CMO_INDEX), y: busB },
    ...cmoTeam.map((_, i) => ({ x: chipCentre(i), y: busB })),
  ]

  return { boxes, edges, ports }
}
