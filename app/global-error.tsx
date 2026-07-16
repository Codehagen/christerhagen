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
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
          <div className="font-mono text-[0.75rem] font-medium tracking-[0.08em] text-(--ink-fainter) uppercase">
            Error
          </div>
          <h1 className="max-w-[20ch] text-[clamp(1.5rem,6vw,1.875rem)] leading-[1.3] font-normal tracking-[-0.015em] text-(--ink-strong)">
            Something went wrong.
          </h1>
          <p className="max-w-[42ch] text-[1rem] leading-[1.6] text-(--ink-muted)">
            The site ran into an unexpected problem. Please try again in a
            moment.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-full bg-foreground px-[22px] py-[14px] text-[0.8125rem] text-background transition-[background-color,transform] duration-150 hover:bg-(--rust-deep) active:scale-[0.97]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
