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
  lang: "no",
  title: "Om",
  description:
    "Christer Hagen er en norsk seriegründer og programvareutvikler i Bodø, grunnlegger av Codebase og Not Another VC, som solgte Docdir til Visma i 2026.",
})

export default function AboutPageNo() {
  return (
    <div lang="no" className="min-h-svh">
      <JsonLd data={profilePageLd("no")} />
      <JsonLd data={faqLd(faqItems.no)} />
      <PenProvider color="rust">
        <SiteHeader active="about" lang="no" />
        <AboutContent lang="no" />
        <SiteFooter lang="no" variant="signature" />
      </PenProvider>
    </div>
  )
}
