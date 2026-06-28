import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AboutContent } from "@/components/about-content"
import { JsonLd } from "@/components/json-ld"
import { profilePageLd, faqLd, pageMetadata } from "@/lib/seo"
import { faqItems } from "@/lib/faq"

export const metadata: Metadata = pageMetadata({
  path: "/about",
  lang: "en",
  title: "About",
  description:
    "A serial entrepreneur and software developer, building from the north of Norway.",
})

export default function AboutPage() {
  return (
    <div lang="en" className="flex min-h-svh flex-col bg-background text-foreground">
      <JsonLd data={profilePageLd("en")} />
      <JsonLd data={faqLd(faqItems.en)} />
      <SiteHeader active="about" lang="en" />
      <AboutContent lang="en" />
      <SiteFooter lang="en" />
    </div>
  )
}
