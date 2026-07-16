"use client"

import * as React from "react"
import { Link } from "next-view-transitions"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { eyebrow } from "@/lib/typography"

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
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader lang="en" />
      <main
        id="main"
        className="mx-auto flex w-full max-w-[740px] flex-1 flex-col items-start justify-center px-5 py-24 sm:px-7"
      >
        <div className={`${eyebrow} enter`}>Error</div>
        <h1 className="enter mt-6 max-w-[18ch] text-[clamp(1.625rem,7vw,2.0625rem)] leading-[1.3] font-normal tracking-[-0.015em] text-(--ink-strong)">
          Something went wrong.
        </h1>
        <p className="enter enter-delay mt-5 max-w-[42ch] text-[1.0625rem] leading-[1.62] font-normal text-(--ink-muted)">
          This page ran into an unexpected problem. Trying again usually clears
          it — if it keeps happening, head back home.
        </p>
        <div className="enter enter-delay mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: "pill", size: "pill" })}
          >
            Try again
          </button>
          <Link
            href="/"
            className={buttonVariants({ variant: "pill-outline", size: "pill" })}
          >
            Back home
          </Link>
        </div>
      </main>
      <SiteFooter lang="en" />
    </div>
  )
}
