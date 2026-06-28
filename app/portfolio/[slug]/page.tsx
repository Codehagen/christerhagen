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
    return { title: "Christer Hagen" }
  }
  const company = companies.en[slug]
  return {
    title: `${company.name} — Christer Hagen`,
    description: company.tagline,
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
      <SiteHeader active="portfolio" />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-[28px]">
        <CompanyContent slug={slug} />
      </main>
      <SiteFooter />
    </div>
  )
}
