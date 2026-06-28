import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProcessContent } from "@/components/process-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/process",
  lang: "no",
  title: "Slik jobber jeg",
  description:
    "Jeg investerer tidlig og holder meg nær. Slik jobber jeg med gründerne jeg investerer i.",
})

export default function ProcessPageNo() {
  return (
    <div
      lang="no"
      className="flex min-h-svh flex-col bg-background text-foreground"
    >
      <SiteHeader lang="no" />
      <ProcessContent lang="no" />
      <SiteFooter lang="no" />
    </div>
  )
}
