import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import { PortfolioContent } from "@/components/portfolio-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/portfolio",
  lang: "no",
  title: "Portefølje — selskaper og investeringer",
  description:
    "Selskaper jeg har bygget, investert i og solgt — Codebase, Sailsdock og Docdir, kjøpt av Visma. Mest programvare, mest norsk, mest pre-seed.",
})

export default function PortfolioPageNo() {
  return (
    <PenProvider color="red">
      <div lang="no" className="flex min-h-svh flex-col bg-ground text-ink">
        <SiteHeader active="portfolio" lang="no" />
        <PortfolioContent lang="no" />
        <SiteFooter lang="no" column="wide" />
      </div>
    </PenProvider>
  )
}
