import type { Metadata } from "next"
import { companies, type CompanySlug, type Lang } from "@/lib/companies"
import { posts, type PostSlug } from "@/lib/posts"

export const SITE_URL = "https://www.christerhagen.com"

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
}): Metadata {
  const {
    path,
    lang,
    title,
    titleAbsolute,
    description,
    ogType,
    publishedTime,
  } = opts
  const canonical = localizedPath(path, lang)
  const ogTitle = titleAbsolute ?? title
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
    },
    openGraph: {
      url: canonical,
      title: ogTitle,
      description,
      type: ogType ?? "website",
      locale: lang === "no" ? "nb_NO" : "en_US",
      images: ["/opengraph-image"],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ["/opengraph-image"],
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
    image: siteUrl("/opengraph-image"),
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
