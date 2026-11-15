import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PenProvider } from "@/components/site/pen"
import { SiteFooter } from "@/components/site-footer"
import { HomeContent } from "@/components/home-content"
import { personGraph, pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = pageMetadata({
  path: "/",
  lang: "no",
  titleAbsolute: "Christer Hagen · Seriegründer og programvareutvikler",
  description:
    "Norsk seriegründer og programvareutvikler fra Bodø. Grunnlegger av Codebase og Not Another VC; solgte AI-selskapet Docdir til Visma i 2026.",
})

export default function HomePageNo() {
  return (
    <div lang="no" className="min-h-svh">
      <JsonLd data={personGraph()} />
      <PenProvider color="rose">
        <SiteHeader lang="no" />
        <HomeContent lang="no" />
        <SiteFooter lang="no" />
      </PenProvider>
    </div>
  )
}
