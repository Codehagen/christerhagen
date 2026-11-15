import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BrandContent } from "@/components/brand-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/brand",
  lang: "no",
  title: "Brand kit",
  description:
    "Typografien, fargene og stemmen bak christerhagen.com - redaksjonelt, nedtonet, tospråklig.",
})

export default function BrandPageNo() {
  return (
    <div lang="no" className="min-h-svh">
      <SiteHeader lang="no" />
      <BrandContent lang="no" />
      <SiteFooter lang="no" column="wide" />
    </div>
  )
}
