import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PrivacyContent } from "@/components/privacy-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  lang: "en",
  title: "Privacy",
  description:
    "No analytics, no cookies, no tracking. What this site does — and does not do — with your data.",
})

export default function PrivacyPage() {
  return (
    <div
      lang="en"
      className="flex min-h-svh flex-col bg-background text-foreground"
    >
      <SiteHeader lang="en" />
      <PrivacyContent lang="en" />
      <SiteFooter lang="en" />
    </div>
  )
}
