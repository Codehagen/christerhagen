import type { Metadata } from "next"
import { Link } from "next-view-transitions"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { eyebrow } from "@/lib/typography"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader lang="en" />
      <main
        id="main"
        className="mx-auto flex w-full max-w-[740px] flex-1 flex-col items-start justify-center px-5 py-24 sm:px-7"
      >
        <div className={`${eyebrow} enter`}>404</div>
        <h1 className="enter mt-6 max-w-[18ch] text-[clamp(1.625rem,7vw,2.0625rem)] leading-[1.3] font-normal tracking-[-0.015em] text-(--ink-strong)">
          This page doesn’t exist.
        </h1>
        <p className="enter enter-delay mt-5 max-w-[42ch] text-[1.0625rem] leading-[1.62] font-normal text-(--ink-muted)">
          The link may be broken, or the page may have moved. Let’s get you back
          to something that does exist.
        </p>
        <Link
          href="/"
          className={`${buttonVariants({ variant: "pill", size: "pill" })} enter enter-delay mt-8`}
        >
          Back home
        </Link>
      </main>
      <SiteFooter lang="en" />
    </div>
  )
}
