import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BrandContent } from "@/components/brand-content"

export const metadata: Metadata = {
  title: "Brand kit",
  description:
    "The type, colour and voice behind christerhagen.com - editorial, restrained, bilingual.",
}

export default function BrandPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <BrandContent />
      <SiteFooter />
    </div>
  )
}
