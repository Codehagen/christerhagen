import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import { ProcessContent } from "@/components/process-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/process",
  lang: "en",
  title: "How I work",
  description:
    "I invest early and stay close. How I work with the founders I back.",
})

export default function ProcessPage() {
  return (
    <div lang="en" className="min-h-svh">
      <PenProvider color="rust">
        <SiteHeader lang="en" />
        <ProcessContent lang="en" />
        <SiteFooter lang="en" column="wide" />
      </PenProvider>
    </div>
  )
}
