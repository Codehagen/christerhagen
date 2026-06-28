import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProcessContent } from "@/components/process-content"

export const metadata: Metadata = {
  title: "How I work",
  description:
    "I invest early and stay close. How I work with the founders I back.",
  alternates: { canonical: "/process" },
  openGraph: {
    url: "/process",
    title: "How I work",
    description:
      "I invest early and stay close. How I work with the founders I back.",
  },
}

export default function ProcessPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <ProcessContent />
      <SiteFooter />
    </div>
  )
}
