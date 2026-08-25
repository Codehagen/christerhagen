import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

import {
  visualModes,
  visualSolids,
  visualSubstrates,
  type DeckVisualConfig,
} from "@/lib/deck-visual"

const outputPath = "data/deck-visual.json"

const numberKeys = [
  "seed",
  "density",
  "lineWeight",
  "wobble",
  "backlash",
  "bloom",
  "halo",
  "misregistration",
  "overdraw",
  "perspective",
  "rotation",
  "hatch",
  "hatchAngle",
  "fibre",
  "secondInk",
  "nodeScale",
  "rankGap",
] as const

function isConfig(value: unknown): value is DeckVisualConfig {
  if (!value || typeof value !== "object") return false
  const config = value as Record<string, unknown>
  return (
    numberKeys.every((key) => typeof config[key] === "number") &&
    visualModes.some((mode) => mode.id === config.mode) &&
    visualSolids.some((solid) => solid.id === config.solid) &&
    visualSubstrates.some((substrate) => substrate.id === config.substrate)
  )
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Development only" }, { status: 403 })
  }

  const config: unknown = await request.json()
  if (!isConfig(config)) {
    return NextResponse.json({ error: "Invalid configuration" }, { status: 400 })
  }

  const absolutePath = path.join(process.cwd(), outputPath)
  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(config, null, 2)}\n`, "utf8")

  return NextResponse.json({ path: outputPath })
}
