import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AboutContent } from "@/components/about-content"
import { JsonLd } from "@/components/json-ld"
import { profilePageLd, faqLd, pageMetadata } from "@/lib/seo"
import { faqItems } from "@/lib/faq"

export const metadata: Metadata = pageMetadata({
  path: "/about",
  lang: "no",
  title: "About",
  description:
    "A serial entrepreneur and angel investor, building from the north of Norway.",
})

export default function AboutPageNo() {
  return (
    <div lang="no" className="flex min-h-svh flex-col bg-background text-foreground">
      <JsonLd data={profilePageLd("no")} />
      <JsonLd data={faqLd(faqItems.no)} />
      <SiteHeader active="about" lang="no" />
      <AboutContent lang="no" />
      <SiteFooter lang="no" />
    </div>
  )
}
