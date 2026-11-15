import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PenProvider } from "@/components/site/pen"
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
    "Christer Hagen is a serial entrepreneur and software developer in Bodø — founder of Codebase and Not Another VC, who sold Docdir to Visma in 2026.",
})

export default function AboutPage() {
  return (
    <div lang="en" className="min-h-svh">
      <JsonLd data={profilePageLd("en")} />
      <JsonLd data={faqLd(faqItems.en)} />
      <PenProvider color="rust">
        <SiteHeader active="about" lang="en" />
        <AboutContent lang="en" />
        <SiteFooter lang="en" variant="signature" />
      </PenProvider>
    </div>
  )
}
