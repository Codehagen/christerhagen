"use client"

import * as React from "react"
import { Link } from "next-view-transitions"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { eyebrow } from "@/lib/typography"

// Norwegian error boundary for the /no subtree. Mirrors app/error.tsx but in
// Norwegian, matching the localized not-found boundary. The error object is
// never shown to the visitor.
export default function ErrorNo({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Kun for feilsøking i konsollen; vises aldri i grensesnittet.
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader lang="no" />
      <main
        id="main"
        className="mx-auto flex w-full max-w-[740px] flex-1 flex-col items-start justify-center px-5 py-24 sm:px-7"
      >
        <div className={eyebrow}>Feil</div>
        <h1 className="mt-6 max-w-[18ch] text-[clamp(26px,7vw,33px)] leading-[1.3] font-normal tracking-[-0.015em] text-(--ink-strong)">
          Noe gikk galt.
        </h1>
        <p className="mt-5 max-w-[42ch] text-[17px] leading-[1.62] font-normal text-(--ink-muted)">
          Denne siden støtte på et uventet problem. Som regel hjelper det å
          prøve igjen — hvis ikke, gå tilbake til forsiden.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: "pill", size: "pill" })}
          >
            Prøv igjen
          </button>
          <Link
            href="/no"
            className={buttonVariants({ variant: "pill-outline", size: "pill" })}
          >
            Tilbake til forsiden
          </Link>
        </div>
      </main>
      <SiteFooter lang="no" />
    </div>
  )
}
