"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

const STORAGE_KEY = "ch_lang"

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "no" || stored === "en") {
      return stored
    }
  } catch {
    // ignore
  }
  return "en"
}

let listeners: Array<() => void> = []

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(onChange: () => void) {
  listeners.push(onChange)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onChange()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange)
    window.removeEventListener("storage", onStorage)
  }
}

function getSnapshot(): Lang {
  return readLang()
}

function getServerSnapshot(): Lang {
  return "en"
}

function setLang(next: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // ignore
  }
  emit()
}

/**
 * SSR-safe access to the persisted language. Server (and first client paint)
 * render "en"; once mounted, the localStorage value takes over. Backed by an
 * external store so the header and page content stay in sync without a context.
 */
export function useLanguage() {
  const lang = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  return { lang, setLang }
}

/** Kept as a passthrough so the app root can own future language wiring. */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function HtmlLang() {
  const { lang } = useLanguage()
  React.useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return null
}
