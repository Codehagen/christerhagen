import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactContent } from "@/components/contact-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  lang: "no",
  title: "Kontakt",
  description:
    "Bygger du noe? Jeg investerer i tekniske gründere i tidlig fase i Norge og Norden.",
})

export default function ContactPageNo() {
  return (
    <div
      lang="no"
      className="flex min-h-svh flex-col bg-background text-foreground"
    >
      <SiteHeader active="contact" lang="no" />
      <ContactContent lang="no" />
      <SiteFooter lang="no" />
    </div>
  )
}
