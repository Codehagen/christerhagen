import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

import {
  presentationModes,
  type PresentationStyleConfig,
} from "@/lib/presentation-style"

const outputPath = "data/presentation-style.json"

function isConfig(value: unknown): value is PresentationStyleConfig {
  if (!value || typeof value !== "object") return false
  const config = value as Record<string, unknown>
  return (
    typeof config.seed === "number" &&
    presentationModes.some((mode) => mode.id === config.mode) &&
    typeof config.glow === "number" &&
    typeof config.lineWeight === "number" &&
    typeof config.jitter === "number" &&
    typeof config.texture === "number" &&
    typeof config.gridDensity === "number" &&
    typeof config.annotation === "number"
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
