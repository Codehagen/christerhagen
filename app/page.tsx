import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HomeContent } from "@/components/home-content"

export const metadata: Metadata = {
  title: "Serial Entrepreneur & Angel Investor",
  description:
    "Norwegian serial entrepreneur and angel investor based in Bodø. Founder of Codebase and Not Another VC.",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://christerhagen.com/#christer",
      name: "Christer Hagen",
      givenName: "Christer",
      familyName: "Hagen",
      jobTitle: "Serial Entrepreneur & Angel Investor",
      description:
        "Norwegian serial entrepreneur and angel investor based in Bodø. Founder of Codebase and Not Another VC.",
      url: "https://christerhagen.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bodø",
        addressRegion: "Nordland",
        addressCountry: "NO",
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Nord University" },
      award: "Top 4% - NM i AI 2026",
      sameAs: [
        "https://www.linkedin.com/in/christerhagen",
        "https://github.com/Codehagen",
        "https://x.com/CodeHagen",
        "https://www.instagram.com/christerhagen/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://christerhagen.com/#website",
      url: "https://christerhagen.com",
      name: "Christer Hagen",
      publisher: { "@id": "https://christerhagen.com/#christer" },
    },
    {
      "@type": "Organization",
      "@id": "https://christerhagen.com/#codebase",
      name: "Codebase",
      description: "Technology studio and angel investor.",
      founder: { "@id": "https://christerhagen.com/#christer" },
    },
    {
      "@type": "Organization",
      "@id": "https://christerhagen.com/#nav",
      name: "Not Another Venture Capital",
      url: "https://notanother.vc",
      description:
        "Pre-seed angel investing in people building things worth seeing in the world.",
      founder: { "@id": "https://christerhagen.com/#christer" },
    },
  ],
}

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader showCta />
      <HomeContent />
      <SiteFooter />
    </div>
  )
}
