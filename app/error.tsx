"use client"

import * as React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import { StatusContent } from "@/components/status-content"
import { TextLink } from "@/components/site/link"

// App-level error boundary for the English subtree. Catches unexpected runtime
// errors during render so visitors get a calm, branded recovery screen instead
// of the default 500 page. The error object is deliberately never shown — no
// message, stack, or digest reaches the user.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Send to the console for debugging only; never surfaced in the UI.
    console.error(error)
  }, [error])

  return (
    <div className="min-h-svh">
      <PenProvider color="rust">
        <SiteHeader lang="en" />
        <StatusContent
          kicker="Error"
          head="Something went wrong."
          body="This page ran into an unexpected problem. Trying again usually clears it. If it keeps happening, head back home."
        >
          <p className="mt-[26px] flex min-h-11 flex-wrap items-center gap-x-5">
            <button
              type="button"
              onClick={reset}
              className="ink-link hit press"
            >
              Try again
            </button>
            <TextLink href="/">Back home</TextLink>
          </p>
        </StatusContent>
        <SiteFooter lang="en" column="wide" />
      </PenProvider>
    </div>
  )
}
