import { describe, expect, it } from "vitest"

import { boxPath } from "@/lib/deck-draw"
import {
  defaultDeckVisual,
  renderDeckVisual,
  visualModes,
  visualSolids,
} from "@/lib/deck-visual"
import { flowChartLayout } from "@/lib/flow-chart"
import { orgChartLayout } from "@/lib/org-chart"

describe("deck visual renderer", () => {
  it("is deterministic for the same configuration", () => {
    expect(renderDeckVisual(defaultDeckVisual)).toEqual(
      renderDeckVisual(defaultDeckVisual),
    )
  })

  it("changes generated geometry when the seed changes", () => {
    const first = renderDeckVisual(defaultDeckVisual)
    const second = renderDeckVisual({
      ...defaultDeckVisual,
      seed: defaultDeckVisual.seed + 1,
    })

    expect(second.paths).not.toEqual(first.paths)
  })

  it.each(visualModes)("renders the $id mode inside the canvas", ({ id }) => {
    const scene = renderDeckVisual({ ...defaultDeckVisual, mode: id })

    expect(scene.width).toBe(960)
    expect(scene.height).toBe(540)
    expect(scene.paths.length).toBeGreaterThan(0)
    expect(scene.segments).toBeGreaterThan(0)
    expect(scene.refresh).toBeGreaterThan(0)
    expect(scene.refresh).toBeLessThanOrEqual(1)
  })

  it.each(visualSolids)("renders the $id wireframe", ({ id }) => {
    const scene = renderDeckVisual({
      ...defaultDeckVisual,
      mode: "legeme",
      solid: id,
    })

    expect(scene.paths.length).toBeGreaterThan(0)
    expect(scene.paths.every((path) => path.d.startsWith("M"))).toBe(true)
  })

  it("turns optional hatch and second ink layers on and off", () => {
    const plain = renderDeckVisual({
      ...defaultDeckVisual,
      hatch: 0,
      secondInk: 0,
    })
    const layered = renderDeckVisual({
      ...defaultDeckVisual,
      hatch: 1,
      secondInk: 1,
    })

    expect(plain.hatch).toHaveLength(0)
    expect(layered.hatch.length).toBeGreaterThan(0)
    expect(layered.offsets.secondary).not.toEqual({ x: 0, y: 0 })
  })
})

describe("diagram layouts", () => {
  it("scales the flow chart while preserving connected node ids", () => {
    const compact = flowChartLayout({ nodeScale: 0.8 })
    const large = flowChartLayout({ nodeScale: 1.15 })

    expect(compact.boxes.map((box) => box.id)).toEqual(
      large.boxes.map((box) => box.id),
    )
    expect(large.boxes[0].w).toBeGreaterThan(compact.boxes[0].w)
    expect(compact.edges.length).toBeGreaterThan(0)
  })

  it("applies node scale and rank gap to the organization chart", () => {
    const compact = orgChartLayout({ nodeScale: 0.8, rankGap: 0.7 })
    const spacious = orgChartLayout({ nodeScale: 1.15, rankGap: 1.3 })

    expect(compact.boxes.map((box) => box.id)).toEqual(
      spacious.boxes.map((box) => box.id),
    )
    expect(spacious.boxes[0].w).toBeGreaterThan(compact.boxes[0].w)
    expect(spacious.boxes.at(-1)!.y).toBeGreaterThan(compact.boxes.at(-1)!.y)
  })

  it("draws a four-sided box with configurable overshoot", () => {
    expect(boxPath(10, 20, 30, 40, 2)).toBe(
      "M 8 20 H 42 M 40 18 V 62 M 42 60 H 8 M 10 62 V 18",
    )
  })
})
