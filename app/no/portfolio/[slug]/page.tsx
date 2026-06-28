import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  companies,
  companyOrder,
  isCompanySlug,
  uiCopy,
} from "@/lib/companies"
import { CompanyContent } from "@/components/company-content"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { organizationLd, breadcrumbLd, pageMetadata, localizedPath } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

export function generateStaticParams() {
  return companyOrder.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!isCompanySlug(slug)) {
    return { title: "Not found" }
  }
  const company = companies.no[slug]
  return pageMetadata({
    path: "/portfolio/" + slug,
    lang: "no",
    title: company.name,
    description: company.tagline,
  })
}

export default async function CompanyPageNo({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isCompanySlug(slug)) {
    notFound()
  }

  return (
    <div lang="no" className="flex min-h-svh flex-col bg-background text-foreground">
      <JsonLd data={organizationLd(slug, "no")} />
      <JsonLd
        data={breadcrumbLd([
          { name: uiCopy.no.navPortfolio, path: localizedPath("/portfolio", "no") },
          {
            name: companies.no[slug].name,
            path: localizedPath("/portfolio/" + slug, "no"),
          },
        ])}
      />
      <SiteHeader active="portfolio" lang="no" />
      <main id="main" className="mx-auto w-full max-w-[640px] flex-1 px-[28px]">
        <CompanyContent slug={slug} lang="no" />
      </main>
      <SiteFooter lang="no" />
    </div>
  )
}
