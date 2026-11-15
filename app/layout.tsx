import type { Metadata } from "next"
import { ViewTransitions } from "next-view-transitions"

import "./globals.css"
import { fontCaveat, fontInter, fontMono, fontSerif } from "./fonts"
import { LanguageProvider, HtmlLang } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { SITE_URL } from "@/lib/seo"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Christer Hagen",
    template: "%s · Christer Hagen",
  },
  description:
    "Christer Hagen is a Norwegian serial entrepreneur and software developer based in Bodø. He founds software companies and backs technical founders at pre-seed.",
  openGraph: {
    type: "website",
    siteName: "Christer Hagen",
    locale: "en_US",
    alternateLocale: "nb_NO",
    title: "Christer Hagen",
    description:
      "Christer Hagen is a Norwegian serial entrepreneur and software developer based in Bodø. He founds software companies and backs technical founders at pre-seed.",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@CodeHagen",
    title: "Christer Hagen",
    description:
      "Norwegian serial entrepreneur and software developer based in Bodø.",
    images: ["/opengraph-image"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={cn(
          "antialiased",
          fontInter.variable,
          fontCaveat.variable,
          fontSerif.variable,
          fontMono.variable
        )}
      >
        <body>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:rounded-[0.3em] focus:bg-ink focus:px-3 focus:py-2 focus:text-ui focus:text-ground"
          >
            Skip to content
          </a>
          <HtmlLang />
          <LanguageProvider>{children}</LanguageProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
