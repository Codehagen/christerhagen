import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About — Christer Hagen",
  description:
    "A serial entrepreneur and angel investor, building from the north of Norway.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader active="about" />
      <AboutContent />
      <SiteFooter />
    </div>
  )
}
