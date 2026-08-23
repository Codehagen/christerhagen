import type { Metadata } from "next"
import {
  companies,
  companyOrder,
  type CompanySlug,
  type Lang,
} from "@/lib/companies"
import { posts, type PostSlug } from "@/lib/posts"

export const SITE_URL = "https://www.christerhagen.com"

/**
 * Contact + location facts shared by every Organization node in the graph.
 * Deliberately city-level: this is a one-person practice run out of Bod\u00f8,
 * and a street address would publish a home address for no gain. The email is
 * the same public address already printed on /contact and the home page.
 */
export const CONTACT_EMAIL = "christer.hagen@gmail.com"

export const BUSINESS_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Bod\u00f8",
  addressRegion: "Nordland",
  addressCountry: "NO",
} as const

export function businessContactPoint(orgName: string) {
  return {
    "@type": "ContactPoint",
    contactType: "business enquiries",
    name: orgName + " \u2014 Christer Hagen",
    email: CONTACT_EMAIL,
    url: SITE_URL + "/contact",
    availableLanguage: ["en", "nb-NO"],
    areaServed: "NO",
  }
}

export function siteUrl(path = ""): string {
  return SITE_URL + path
}

/**
 * Map an EN root path to its locale-specific path.
 * EN keeps the root URLs; NO is mirrored under /no/*.
 * @param path an EN path beginning with "/"
 */
export function localizedPath(path: string, lang: Lang): string {
  if (lang === "en") return path
  return path === "/" ? "/no" : "/no" + path
}

/**
 * hreflang alternates map for a given EN path.
 * EN = root path, nb-NO = the /no mirror, x-default = EN.
 */
export function i18nLanguages(path: string): Record<string, string> {
  return {
    en: path,
    "nb-NO": localizedPath(path, "no"),
    "x-default": path,
  }
}

/**
 * Build per-page Metadata with reciprocal hreflang, a per-locale canonical
 * and an OpenGraph/Twitter card. `path` is always the EN path; pageMetadata
 * localizes the canonical + OpenGraph url for the given lang.
 */
export function pageMetadata(opts: {
  path: string
  lang: Lang
  title?: string
  titleAbsolute?: string
  description: string
  ogType?: "website" | "article"
  publishedTime?: string
  /**
   * When true, omit the explicit site-wide OG image so the route's own
   * colocated `opengraph-image.tsx` (file convention) supplies a per-page image.
   * Used by the writing posts, which render their title into the card.
   */
  routeOgImage?: boolean
}): Metadata {
  const {
    path,
    lang,
    title,
    titleAbsolute,
    description,
    ogType,
    publishedTime,
    routeOgImage,
  } = opts
  const canonical = localizedPath(path, lang)
  const ogTitle = titleAbsolute ?? title
  const ogImage = routeOgImage ? {} : { images: ["/opengraph-image"] }
  return {
    ...(titleAbsolute
      ? { title: { absolute: titleAbsolute } }
      : title
        ? { title }
        : {}),
    description,
    alternates: {
      canonical,
      languages: i18nLanguages(path),
      // Advertise the markdown twin so an agent does not have to probe for it.
      // Served both here and via `Accept: text/markdown` on the canonical URL.
      types: {
        "text/markdown": canonical === "/" ? "/index.md" : canonical + ".md",
      },
    },
    openGraph: {
      url: canonical,
      title: ogTitle,
      description,
      type: ogType ?? "website",
      locale: lang === "no" ? "nb_NO" : "en_US",
      ...ogImage,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...ogImage,
    },
  }
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
      // First node in the graph: brand-detecting crawlers read the head of the
      // graph to decide what this site *is called*. Leading with the Person's
      // own WebSite (rather than a portfolio company) keeps the answer
      // "Christer Hagen" instead of the far more generic "Codebase".
      {
        "@type": "WebSite",
        "@id": SITE_URL + "/#website",
        url: SITE_URL,
        name: "Christer Hagen",
        // No "Codebase" variant here on purpose: brand detectors pick the name
        // up from this node, and "Codebase" is generic enough that a search for
        // it never surfaces this domain.
        alternateName: ["christerhagen.com"],
        description:
          "Norwegian serial entrepreneur and software developer based in Bod\u00f8. Founder of Codebase and Not Another VC.",
        inLanguage: ["en", "nb-NO"],
        publisher: { "@id": SITE_URL + "/#christer" },
        about: { "@id": SITE_URL + "/#christer" },
        identifier: "https://www.wikidata.org/wiki/Q140373910",
        sameAs: [
          "https://www.wikidata.org/wiki/Q140373910",
          "https://www.linkedin.com/in/christerhagen",
          "https://github.com/Codehagen",
          "https://x.com/CodeHagen",
          "https://www.crunchbase.com/person/christer-hagen",
        ],
      },
      {
        "@type": "Person",
        "@id": SITE_URL + "/#christer",
        name: "Christer Hagen",
        givenName: "Christer",
        familyName: "Hagen",
        jobTitle: "Serial Entrepreneur & Software Developer",
        description:
          "Norwegian serial entrepreneur and software developer based in Bodø. Founder of Codebase and Not Another VC.",
        url: SITE_URL,
        image: siteUrl("/images/christer-hagen-portrait.jpg"),
        // Birth + nationality facts mirror Wikidata P569/P19/P27. Keeping them
        // identical across the site, Wikidata and LinkedIn is what builds
        // Google's Knowledge Graph confidence in the entity.
        birthDate: "1991-02-27",
        birthPlace: {
          "@type": "Place",
          name: "Fauske, Norway",
        },
        nationality: {
          "@type": "Country",
          name: "Norway",
        },
        knowsLanguage: ["nb-NO", "en"],
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
          "https://www.wikidata.org/wiki/Q140373910",
          "https://www.crunchbase.com/person/christer-hagen",
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
      // Type breadth, all of it describing things actually rendered on the home
      // page: the page itself, and the list of ventures it shows.
      {
        "@type": "WebPage",
        "@id": SITE_URL + "/#webpage",
        url: SITE_URL,
        name: "Christer Hagen",
        isPartOf: { "@id": SITE_URL + "/#website" },
        about: { "@id": SITE_URL + "/#christer" },
        primaryImageOfPage: siteUrl("/images/christer-hagen-portrait.jpg"),
        inLanguage: "en",
      },
      {
        // What the home page actually offers a reader who is building something:
        // an angel cheque and hands-on help. Described on /process in full.
        "@type": "Service",
        "@id": SITE_URL + "/#angel-investing",
        name: "Pre-seed angel investment",
        serviceType: "Angel investment",
        description:
          "Pre-seed cheques and hands-on help for technical founders, decided personally rather than by committee.",
        provider: { "@id": SITE_URL + "/#christer" },
        url: siteUrl("/process"),
        areaServed: [
          { "@type": "Country", name: "Norway" },
          { "@type": "Place", name: "The Nordics" },
        ],
        audience: {
          "@type": "Audience",
          audienceType: "Technical founders at pre-seed stage",
        },
      },
      {
        "@type": "ItemList",
        "@id": SITE_URL + "/#ventures",
        name: "Companies founded and backed by Christer Hagen",
        url: siteUrl("/portfolio"),
        numberOfItems: companyOrder.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: companyOrder.map((slug, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: companies.en[slug].name,
          url: siteUrl("/portfolio/" + slug),
        })),
      },
      {
        "@type": "Organization",
        "@id": SITE_URL + "/#codebase",
        name: "Codebase",
        url: SITE_URL + "/portfolio/codebase",
        description: "Technology studio and angel investor.",
        founder: { "@id": SITE_URL + "/#christer" },
        email: "mailto:" + CONTACT_EMAIL,
        contactPoint: businessContactPoint("Codebase"),
        address: BUSINESS_ADDRESS,
      },
      {
        "@type": "Organization",
        "@id": SITE_URL + "/#nav",
        name: "Not Another Venture Capital",
        url: "https://notanother.vc",
        description:
          "Pre-seed angel investing in people building things worth seeing in the world.",
        founder: { "@id": SITE_URL + "/#christer" },
        email: "mailto:" + CONTACT_EMAIL,
        contactPoint: businessContactPoint("Not Another Venture Capital"),
        address: BUSINESS_ADDRESS,
      },
    ],
  }
}

export function profilePageLd(lang: Lang = "en"): object {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": siteUrl(localizedPath("/about", lang)) + "#profile",
    url: siteUrl(localizedPath("/about", lang)),
    name: "About Christer Hagen",
    inLanguage: lang === "no" ? "nb-NO" : "en",
    mainEntity: {
      "@type": "Person",
      "@id": SITE_URL + "/#christer",
      name: "Christer Hagen",
      url: siteUrl("/about"),
      image: siteUrl("/images/christer-hagen-portrait.jpg"),
      jobTitle: "Serial Entrepreneur & Software Developer",
      sameAs: [
        "https://www.linkedin.com/in/christerhagen",
        "https://github.com/Codehagen",
        "https://x.com/CodeHagen",
        "https://www.instagram.com/christerhagen/",
        "https://www.wikidata.org/wiki/Q140373910",
        "https://www.crunchbase.com/person/christer-hagen",
      ],
    },
  }
}

export function organizationLd(slug: CompanySlug, lang: Lang = "en"): object {
  const company = companies[lang][slug]
  // Founder vs funder is a structural fact, not language-dependent — derive it
  // from the canonical EN role ("Grunnlegger" wouldn't match on NO data).
  const isFounder = companies.en[slug].role.includes("Founder")

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.tagline,
    url: siteUrl(localizedPath("/portfolio/" + slug, lang)),
    foundingDate: company.year,
  }

  // Contact + address only on companies Christer founded. On the ones he merely
  // backed, publishing his address as *their* contact point would be a plain
  // factual error, and no check is worth that.
  if (isFounder) {
    ld.founder = { "@id": SITE_URL + "/#christer" }
    ld.email = "mailto:" + CONTACT_EMAIL
    ld.contactPoint = businessContactPoint(company.name)
    ld.address = BUSINESS_ADDRESS
  } else {
    ld.funder = { "@id": SITE_URL + "/#christer" }
  }

  if (slug === "docdir") {
    ld.parentOrganization = { "@type": "Organization", name: "Visma" }
  }

  return ld
}

export function blogPostingLd(slug: PostSlug, lang: Lang = "en"): object {
  const post = posts[lang][slug]
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: {
      "@type": "Person",
      "@id": SITE_URL + "/#christer",
      name: "Christer Hagen",
      url: siteUrl(localizedPath("/about", lang)),
    },
    publisher: {
      "@type": "Organization",
      "@id": SITE_URL + "/#codebase",
      name: "Codebase",
    },
    image: siteUrl(localizedPath("/writing/" + slug, lang) + "/opengraph-image"),
    mainEntityOfPage: siteUrl(localizedPath("/writing/" + slug, lang)),
    url: siteUrl(localizedPath("/writing/" + slug, lang)),
    inLanguage: lang === "no" ? "nb-NO" : "en",
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
