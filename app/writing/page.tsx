import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WritingContent } from "@/components/writing-content"

export const metadata: Metadata = {
  title: "Writing — Christer Hagen",
  description:
    "Notes on building software companies, real estate and investing — from the north of Norway.",
}

export default function WritingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader active="writing" />
      <WritingContent />
      <SiteFooter />
    </div>
  )
}
