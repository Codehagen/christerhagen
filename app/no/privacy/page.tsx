import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PrivacyContent } from "@/components/privacy-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  lang: "no",
  title: "Personvern",
  description:
    "Ingen analyse, ingen informasjonskapsler, ingen sporing. Hva denne siden gjør — og ikke gjør — med dataene dine.",
})

export default function PrivacyPageNo() {
  return (
    <div
      lang="no"
      className="flex min-h-svh flex-col bg-background text-foreground"
    >
      <SiteHeader lang="no" />
      <PrivacyContent lang="no" />
      <SiteFooter lang="no" />
    </div>
  )
}
