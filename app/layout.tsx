import type { Metadata } from "next"
import { Newsreader, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { SITE_URL } from "@/lib/seo"

const fontSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Christer Hagen",
    template: "%s · Christer Hagen",
  },
  description:
    "Norwegian serial entrepreneur and angel investor based in Bodø. Founder of Codebase and Not Another VC.",
  openGraph: {
    type: "website",
    siteName: "Christer Hagen",
    locale: "en_US",
    alternateLocale: "nb_NO",
    title: "Christer Hagen",
    description:
      "Norwegian serial entrepreneur and angel investor based in Bodø. Founder of Codebase and Not Another VC.",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@CodeHagen",
    title: "Christer Hagen",
    description:
      "Norwegian serial entrepreneur and angel investor based in Bodø.",
    images: ["/opengraph-image"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSerif.variable, fontMono.variable)}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:font-mono focus:text-[13px] focus:text-background"
        >
          Skip to content
        </a>
        <ThemeProvider
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
