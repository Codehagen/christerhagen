import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { companies, companyOrder, isCompanySlug, uiCopy } from "@/lib/companies"
import { CompanyContent } from "@/components/company-content"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import {
  organizationLd,
  breadcrumbLd,
  pageMetadata,
  localizedPath,
} from "@/lib/seo"
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
  const company = companies.en[slug]
  return pageMetadata({
    path: "/portfolio/" + slug,
    lang: "en",
    title: company.name,
    description: company.tagline,
  })
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isCompanySlug(slug)) {
    notFound()
  }

  return (
    <PenProvider color="green">
      <div lang="en" className="flex min-h-svh flex-col bg-ground text-ink">
        <JsonLd data={organizationLd(slug, "en")} />
        <JsonLd
          data={breadcrumbLd([
            {
              name: uiCopy.en.navPortfolio,
              path: localizedPath("/portfolio", "en"),
            },
            {
              name: companies.en[slug].name,
              path: localizedPath("/portfolio/" + slug, "en"),
            },
          ])}
        />
        <SiteHeader active="portfolio" lang="en" />
        <CompanyContent key={slug} slug={slug} lang="en" />
        <SiteFooter lang="en" column="wide" />
      </div>
    </PenProvider>
  )
}
