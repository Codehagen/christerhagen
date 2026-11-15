"use client"

import * as React from "react"

import "./globals.css"

// Root-level error boundary. This only renders when the root layout itself
// fails, so it must provide its own <html>/<body> and cannot rely on the
// site header, fonts, or providers. Kept intentionally minimal and
// self-contained. The error object is never shown to the visitor.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="antialiased">
        <main className="px-[var(--page-pad-x)] pt-[94px] lg:ml-[var(--column-wide-left)] lg:w-[var(--column-wide)] lg:px-0">
          <p className="text-ink-muted">Error</p>
          <h1 className="mt-[6px] text-title leading-[var(--leading-title)] font-[var(--weight-strong)] tracking-[var(--tracking-title)]">
            Something went wrong.
          </h1>
          <p className="mt-[10px] max-w-[var(--column)] text-ink-muted">
            The site ran into an unexpected problem. Please try again in a
            moment.
          </p>
          <p className="mt-[26px] flex min-h-11 items-center">
            <button
              type="button"
              onClick={reset}
              className="ink-link hit press"
            >
              Try again
            </button>
          </p>
        </main>
      </body>
    </html>
  )
}
