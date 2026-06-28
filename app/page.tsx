import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HomeContent } from "@/components/home-content"
import { personGraph } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: {
    absolute: "Christer Hagen · Serial Entrepreneur & Angel Investor",
  },
  description:
    "Norwegian serial entrepreneur and angel investor based in Bodø. Founder of Codebase and Not Another VC.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
}

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <JsonLd data={personGraph()} />
      <SiteHeader showCta />
      <HomeContent />
      <SiteFooter />
    </div>
  )
}
