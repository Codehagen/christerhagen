import { companies, type CompanySlug } from "@/lib/companies"
import { posts, type PostSlug } from "@/lib/posts"

export const SITE_URL = "https://www.christerhagen.com"

export function siteUrl(path = ""): string {
  return SITE_URL + path
}

/**
 * The site-wide @graph: Person + WebSite + the two Organizations.
 * Rendered once on the home page. Every other builder references the
 * stable @id nodes defined here (e.g. SITE_URL + "/#christer").
 */
export function personGraph(): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": SITE_URL + "/#christer",
        name: "Christer Hagen",
        givenName: "Christer",
        familyName: "Hagen",
        jobTitle: "Serial Entrepreneur & Angel Investor",
        description:
          "Norwegian serial entrepreneur and angel investor based in Bodø. Founder of Codebase and Not Another VC.",
        url: SITE_URL,
        image: siteUrl("/images/christer-hagen-portrait.jpg"),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bodø",
          addressRegion: "Nordland",
          addressCountry: "NO",
        },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Nord University" },
        award: "Top 4% - NM i AI 2026",
        knowsAbout: [
          "Pre-seed investing",
          "Angel investing",
          "SaaS",
          "Proptech",
          "Norwegian startups",
          "Software entrepreneurship",
        ],
        sameAs: [
          "https://www.linkedin.com/in/christerhagen",
          "https://github.com/Codehagen",
          "https://x.com/CodeHagen",
          "https://www.instagram.com/christerhagen/",
        ],
        founder: [
          { "@id": SITE_URL + "/#codebase" },
          { "@id": SITE_URL + "/#nav" },
        ],
        worksFor: [
          { "@id": SITE_URL + "/#codebase" },
          { "@id": SITE_URL + "/#nav" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": SITE_URL + "/#website",
        url: SITE_URL,
        name: "Christer Hagen",
        publisher: { "@id": SITE_URL + "/#christer" },
      },
      {
        "@type": "Organization",
        "@id": SITE_URL + "/#codebase",
        name: "Codebase",
        description: "Technology studio and angel investor.",
        founder: { "@id": SITE_URL + "/#christer" },
      },
      {
        "@type": "Organization",
        "@id": SITE_URL + "/#nav",
        name: "Not Another Venture Capital",
        url: "https://notanother.vc",
        description:
          "Pre-seed angel investing in people building things worth seeing in the world.",
        founder: { "@id": SITE_URL + "/#christer" },
      },
    ],
  }
}

export function profilePageLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": siteUrl("/about#profile"),
    url: siteUrl("/about"),
    name: "About Christer Hagen",
    mainEntity: { "@id": SITE_URL + "/#christer" },
  }
}

export function organizationLd(slug: CompanySlug): object {
  const company = companies.en[slug]
  const isFounder = company.role.includes("Founder")

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.tagline,
    url: siteUrl("/portfolio/" + slug),
    foundingDate: company.year,
  }

  if (isFounder) {
    ld.founder = { "@id": SITE_URL + "/#christer" }
  } else {
    ld.funder = { "@id": SITE_URL + "/#christer" }
  }

  if (slug === "docdir") {
    ld.parentOrganization = { "@type": "Organization", name: "Visma" }
  }

  return ld
}

export function blogPostingLd(slug: PostSlug): object {
  const post = posts.en[slug]
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: { "@id": SITE_URL + "/#christer" },
    publisher: { "@id": SITE_URL + "/#codebase" },
    image: siteUrl("/opengraph-image"),
    mainEntityOfPage: siteUrl("/writing/" + slug),
    url: siteUrl("/writing/" + slug),
    inLanguage: "en",
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  }
}

export function faqLd(items: { q: string; a: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }
}
