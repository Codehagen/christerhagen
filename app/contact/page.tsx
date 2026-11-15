import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import { ContactContent } from "@/components/contact-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  lang: "en",
  title: "Contact",
  description:
    "Building something? I back early-stage technical founders across Norway and the Nordics.",
})

export default function ContactPage() {
  return (
    <div lang="en" className="min-h-svh">
      <PenProvider color="rust">
        <SiteHeader active="contact" lang="en" />
        <ContactContent lang="en" />
        <SiteFooter lang="en" column="wide" address={false} />
      </PenProvider>
    </div>
  )
}
