"use client"

import * as React from "react"

import { ROUNDS } from "./rounds"
import { inter, pen } from "./fonts"

const KEY = "christerhagen-lab-picks"

// Picks live in localStorage, read through useSyncExternalStore so the server
// renders "no picks" and the client catches up without a setState-in-effect.
let memory = "[]"
const listeners = new Set<() => void>()

function snapshot(): string {
  try {
    return window.localStorage.getItem(KEY) ?? memory
  } catch {
    return memory
  }
}

function writePicks(picks: number[]) {
  memory = JSON.stringify(picks)
  try {
    window.localStorage.setItem(KEY, memory)
  } catch {
    // Private window or blocked storage: picks live for this visit only.
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

const pad = (n: number) => String(n).padStart(2, "0")

export function Lab() {
  const raw = React.useSyncExternalStore(subscribe, snapshot, () => "[]")
  const picks = React.useMemo(() => {
    try {
      return JSON.parse(raw) as number[]
    } catch {
      return []
    }
  }, [raw])
  const [copied, setCopied] = React.useState(false)

  const toggle = (n: number) =>
    writePicks(
      picks.includes(n)
        ? picks.filter((x) => x !== n)
        : [...picks, n].sort((x, y) => x - y)
    )

  const copy = async () => {
    const line = `Keep: ${picks.map(pad).join(", ")}`
    try {
      await navigator.clipboard.writeText(line)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      window.prompt("Copy this", line)
    }
  }

  return (
    <div className={`${inter.variable} ${pen.variable} min-h-svh bg-[#FDFDFC] text-[#111]`} style={{ fontFamily: inter.style.fontFamily, WebkitFontSmoothing: "antialiased" }}>
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[#FDFDFC]/90 px-4 py-3 backdrop-blur sm:px-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[1.0625rem] leading-[1.3] font-semibold">Lab</h1>
          <span className="text-[0.8125rem] leading-[1.45] text-[rgba(18,18,18,0.5)]">
            Tick what you would keep. Discard the rest by saying nothing.
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          disabled={picks.length === 0}
          className="relative h-8 rounded-lg bg-[#111] px-3 font-mono text-[0.8125rem] leading-[1.45] text-[#FDFDFC] tabular-nums transition-[background-color,opacity] duration-150 hover:bg-[#2a2a2a] disabled:opacity-40"
        >
          {copied
            ? "Copied"
            : picks.length
              ? `Copy picks · ${picks.map(pad).join(" ")}`
              : "No picks yet"}
        </button>
      </header>

      {ROUNDS.map((round) => (
        <section key={round.id} className="px-4 pt-6 pb-16 sm:px-8">
          <div className="mx-auto mb-6 max-w-[1180px]">
            <div className="max-w-2xl">
              <h2 className="text-[0.9375rem] leading-[1.35] font-semibold">{round.title}</h2>
              <p className="mt-1 text-[0.8125rem] leading-[1.45] text-[rgba(18,18,18,0.5)]">
                {round.note}
              </p>
            </div>
          </div>

          {round.pieces.length === 0 ? (
            <p className="text-[0.8125rem] leading-[1.45] text-[rgba(18,18,18,0.5)]">
              Nothing in this round yet.
            </p>
          ) : (
            <ol className="mx-auto grid max-w-[1180px] grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
              {round.pieces.map((p) => {
                const kept = picks.includes(p.n)
                return (
                  <li key={p.n} className="flex flex-col gap-3">
                    <div
                      data-kept={kept || undefined}
                      className="relative aspect-[4/3] overflow-hidden rounded-[20px] outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-150 data-kept:outline-[#111]"
                    >
                      <p.Component />
                    </div>
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggle(p.n)}
                        aria-pressed={kept}
                        aria-label={`${kept ? "Unkeep" : "Keep"} ${pad(p.n)}`}
                        className="relative mt-0.5 flex h-7 min-w-11 items-center justify-center rounded-md font-mono text-[0.8125rem] leading-[1.45] tabular-nums shadow-[0_0_0_1px_rgba(18,18,18,0.1)] transition-[background-color,color] duration-150 aria-pressed:bg-[#111] aria-pressed:text-[#FDFDFC]"
                      >
                        {pad(p.n)}
                      </button>
                      <div className="min-w-0">
                        <h3 className="text-[0.9375rem] leading-[1.35] font-semibold">{p.title}</h3>
                        <p className="text-[0.8125rem] leading-[1.45] text-[rgba(18,18,18,0.5)]">
                          {p.take}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      ))}
    </div>
  )
}
