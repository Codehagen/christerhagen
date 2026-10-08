"use client"

// felles motor: blaing, tastatur, husket plass. Layoutene tegner alt annet.

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { slides, type Slide } from "./content"

export type StageProps = { slide: Slide; index: number; total: number }

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

export function Deck({
  Stage,
  storageKey,
}: {
  Stage: (props: StageProps) => React.ReactNode
  storageKey: string
}) {
  const [index, setIndex] = useState(0)

  useIsoLayoutEffect(() => {
    const saved = Number(sessionStorage.getItem(storageKey))
    if (Number.isInteger(saved) && saved > 0 && saved < slides.length) setIndex(saved)
  }, [storageKey])

  // Første kjøring hopper over: da står index fortsatt på 0, og vi ville
  // overskrevet plassen vi nettopp leste tilbake.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    sessionStorage.setItem(storageKey, String(index))
  }, [index, storageKey])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      // En video i fullskjerm eier tastaturet: mellomrom pauser, piler spoler.
      if (document.fullscreenElement) return
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault()
        setIndex((i) => Math.min(slides.length - 1, i + 1))
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        setIndex((i) => Math.max(0, i - 1))
      } else if (e.key === "Home") setIndex(0)
      else if (e.key === "End") setIndex(slides.length - 1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // Klikk hvor som helst blar: venstre tredjedel bakover, resten framover.
  // Lenker og knapper tar klikket selv.
  const onClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return
    const back = e.clientX < window.innerWidth / 3
    setIndex((i) => (back ? Math.max(0, i - 1) : Math.min(slides.length - 1, i + 1)))
  }

  const slide = slides[index]

  return (
    <main
      id="main"
      onClick={onClick}
      aria-roledescription="lysbildefremvisning"
      className="relative h-dvh min-h-[28rem] cursor-default overflow-hidden [font-synthesis:none] select-none"
    >
      <div key={slide.id} aria-live="polite" aria-atomic="true" className="h-full">
        <Stage slide={slide} index={index} total={slides.length} />
      </div>
    </main>
  )
}

/** Lenken mister fokus når den klikkes, så piltastene virker når du kommer tilbake. */
export function DemoLink({
  href,
  className,
  style,
  children,
}: {
  href: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.currentTarget.blur()}
      className={className}
      style={style}
    >
      {children}
    </a>
  )
}

export const pad = (n: number) => String(n).padStart(2, "0")
