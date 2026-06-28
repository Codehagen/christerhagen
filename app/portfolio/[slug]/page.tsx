import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  companies,
  companyOrder,
  isCompanySlug,
} from "@/lib/companies"
import { CompanyContent } from "@/components/company-content"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { organizationLd, breadcrumbLd } from "@/lib/seo"
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
  return {
    title: company.name,
    description: company.tagline,
    alternates: { canonical: "/portfolio/" + slug },
    openGraph: {
      url: "/portfolio/" + slug,
      title: company.name,
      description: company.tagline,
    },
  }
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
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <JsonLd data={organizationLd(slug)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Portfolio", path: "/portfolio" },
          { name: companies.en[slug].name, path: "/portfolio/" + slug },
        ])}
      />
      <SiteHeader active="portfolio" />
      <main id="main" className="mx-auto w-full max-w-[640px] flex-1 px-[28px]">
        <CompanyContent slug={slug} />
      </main>
      <SiteFooter />
    </div>
  )
}
