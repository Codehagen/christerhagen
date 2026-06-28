import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactContent } from "@/components/contact-content"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Building something? I back early-stage technical founders across Norway and the Nordics.",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Contact",
    description:
      "Building something? I back early-stage technical founders across Norway and the Nordics.",
  },
}

export default function ContactPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader active="contact" />
      <ContactContent />
      <SiteFooter />
    </div>
  )
}
