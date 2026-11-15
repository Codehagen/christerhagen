import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WritingContent } from "@/components/writing-content"
import { PenProvider } from "@/components/site/pen"
import { pageMetadata } from "@/lib/seo"
import { writingCopy } from "@/lib/posts"

export const metadata: Metadata = pageMetadata({
  path: "/writing",
  lang: "en",
  title: writingCopy.en.kicker,
  description: writingCopy.en.intro,
})

export default function WritingPage() {
  return (
    <div
      lang="en"
      className="flex min-h-svh flex-col bg-ground text-ink"
    >
      {/* The index's one pen (DESIGN.md §3): rust, header ring included. */}
      <PenProvider color="rust">
        <SiteHeader active="writing" lang="en" />
        <WritingContent lang="en" />
        <SiteFooter lang="en" />
      </PenProvider>
    </div>
  )
}
