import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AboutContent } from "@/components/about-content"
import { JsonLd } from "@/components/json-ld"
import { profilePageLd, faqLd } from "@/lib/seo"
import { faqItems } from "@/lib/faq"

export const metadata: Metadata = {
  title: "About",
  description:
    "A serial entrepreneur and angel investor, building from the north of Norway.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
}

export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <JsonLd data={profilePageLd()} />
      <JsonLd data={faqLd(faqItems.en)} />
      <SiteHeader active="about" />
      <AboutContent />
      <SiteFooter />
    </div>
  )
}
