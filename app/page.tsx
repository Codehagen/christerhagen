import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HomeContent } from "@/components/home-content"
import { personGraph, pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = pageMetadata({
  path: "/",
  lang: "en",
  titleAbsolute: "Christer Hagen · Serial Entrepreneur & Software Developer",
  description:
    "Norwegian serial entrepreneur and software developer based in Bodø. Founder of Codebase and Not Another VC.",
})

export default function HomePage() {
  return (
    <div lang="en" className="min-h-svh bg-background text-foreground">
      <JsonLd data={personGraph()} />
      <SiteHeader showCta lang="en" />
      <HomeContent lang="en" />
      <SiteFooter lang="en" />
    </div>
  )
}
