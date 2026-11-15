"use client"

import * as React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import { StatusContent } from "@/components/status-content"
import { TextLink } from "@/components/site/link"

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
    <div className="min-h-svh">
      <PenProvider color="rust">
        <SiteHeader lang="no" />
        <StatusContent
          kicker="Feil"
          head="Noe gikk galt."
          body="Denne siden støtte på et uventet problem. Som regel hjelper det å prøve igjen. Hvis ikke, gå tilbake til forsiden."
        >
          <p className="mt-[26px] flex min-h-11 flex-wrap items-center gap-x-5">
            <button
              type="button"
              onClick={reset}
              className="ink-link hit press"
            >
              Prøv igjen
            </button>
            <TextLink href="/no">Tilbake til forsiden</TextLink>
          </p>
        </StatusContent>
        <SiteFooter lang="no" column="wide" />
      </PenProvider>
    </div>
  )
}
