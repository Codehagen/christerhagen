#!/usr/bin/env node
// Outer loop of plan 006: force a fresh is-agentic scan of production, diff it
// against the last committed result, and say what moved.
//
//   pnpm agentic:watch            # scan, diff, print
//   pnpm agentic:watch --write    # ...and update .agentic/report.json
//
// Exits non-zero when the score drops or a new issue appears, so this can run
// on a schedule and only interrupt anyone when something actually changed.
//
// Why this and not `npx is-agentic`: the published API is read-only and the CLI
// only scans when *no* report exists, so neither re-measures a site that already
// has one. The rescan trigger is the endpoint the site's own Rescan button uses.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"

const TARGET = process.env.AGENTIC_TARGET || "https://www.christerhagen.com"
const SNAPSHOT = ".agentic/report.json"
const WRITE = process.argv.includes("--write")

const STREAM =
  "https://is-agentic.com/api/scan/stream?target=" +
  encodeURIComponent(TARGET) +
  "&force=1"

/** Read the SSE stream to completion and return the two events that matter. */
async function scan() {
  const res = await fetch(STREAM, {
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-store",
      "User-Agent": "christerhagen-agentic-watch/1.0",
    },
  })
  if (!res.ok || !res.body) {
    throw new Error(`Scan stream returned HTTP ${res.status}.`)
  }

  const decoder = new TextDecoder()
  let buffer = ""
  let complete = null
  let relevance = null

  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true })
    let cut
    while ((cut = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, cut)
      buffer = buffer.slice(cut + 2)
      const line = frame.split("\n").find((l) => l.startsWith("data: "))
      if (!line) continue
      let event
      try {
        event = JSON.parse(line.slice(6))
      } catch {
        continue
      }
      if (event.type === "error") throw new Error(event.error || "Scan failed.")
      if (event.type === "scan_complete") complete = event.result
      if (event.type === "relevance_assessed") relevance = event
    }
  }

  if (!complete) throw new Error("Scan stream ended before a result arrived.")
  return { complete, relevance }
}

/** The public report is what anyone else sees, so it is what we record. */
async function publicReport() {
  const res = await fetch(
    "https://is-agentic.com/api/v1/report?url=" + encodeURIComponent(TARGET),
    { headers: { accept: "application/json" } }
  )
  if (!res.ok) return null
  return res.json()
}

function loadSnapshot() {
  try {
    return JSON.parse(readFileSync(SNAPSHOT, "utf8"))
  } catch {
    return null
  }
}

function issueKey(issue) {
  return `${issue.tier}/${issue.id}`
}

const { complete, relevance } = await scan()
const report = await publicReport()
const previous = loadSnapshot()

const current = {
  target: TARGET,
  // The public score lags the live scan; record both so a lagging report is
  // visible as a lag rather than read as a regression.
  public_score: report?.score ?? null,
  public_scanned_at: report?.scanned_at ?? null,
  live_relevance_score: relevance?.score ?? null,
  live_scanned_at: complete.scannedAt,
  score_breakdown: report?.score_breakdown ?? null,
  issues: (report?.issues ?? []).map((i) => ({
    id: i.id,
    tier: i.tier,
    result: i.result,
    details: i.details,
  })),
}

console.log(`target            ${TARGET}`)
console.log(`public score      ${current.public_score ?? "—"}/100  (scanned ${current.public_scanned_at ?? "—"})`)
console.log(`live relevance    ${current.live_relevance_score ?? "—"}/100  (scanned ${current.live_scanned_at})`)
if (current.score_breakdown) {
  const b = current.score_breakdown
  console.log(
    `breakdown         essential ${b.essential.earned}/${b.essential.available} · ` +
      `recommended ${b.recommended.earned}/${b.recommended.available} · bonus ${b.bonus.points}`
  )
}
console.log(`open issues       ${current.issues.length}`)
for (const i of current.issues) {
  console.log(`  - [${i.tier}/${i.result}] ${i.id}: ${i.details?.slice(0, 100) ?? ""}`)
}

let regressed = false

if (!previous) {
  console.log("\nNo previous snapshot; recording this one as the baseline.")
} else {
  const was = new Set(previous.issues.map(issueKey))
  const now = new Set(current.issues.map(issueKey))
  const appeared = [...now].filter((k) => !was.has(k))
  const cleared = [...was].filter((k) => !now.has(k))

  console.log(
    `\nsince ${previous.public_scanned_at ?? previous.live_scanned_at}: ` +
      `${previous.public_score} → ${current.public_score}`
  )
  for (const k of cleared) console.log(`  fixed    ${k}`)
  for (const k of appeared) console.log(`  NEW      ${k}`)

  if (
    typeof current.public_score === "number" &&
    typeof previous.public_score === "number" &&
    current.public_score < previous.public_score
  ) {
    console.log(`\nREGRESSION: score fell by ${previous.public_score - current.public_score}.`)
    regressed = true
  }
  if (appeared.length > 0) regressed = true
  if (!regressed && cleared.length === 0 && appeared.length === 0) {
    console.log("  (no change)")
  }
}

if (WRITE) {
  mkdirSync(dirname(SNAPSHOT), { recursive: true })
  writeFileSync(SNAPSHOT, JSON.stringify(current, null, 2) + "\n")
  console.log(`\nWrote ${SNAPSHOT}.`)
}

process.exit(regressed ? 1 : 0)
