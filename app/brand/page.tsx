import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BrandContent } from "@/components/brand-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/brand",
  lang: "en",
  title: "Brand kit",
  description:
    "The type, colour and voice behind christerhagen.com - editorial, restrained, bilingual.",
})

export default function BrandPage() {
  return (
    <div
      lang="en"
      className="flex min-h-svh flex-col bg-background text-foreground"
    >
      <SiteHeader lang="en" />
      <BrandContent lang="en" />
      <SiteFooter lang="en" />
    </div>
  )
}
