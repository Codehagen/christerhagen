import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import { RecoveryLinks } from "@/components/recovery-links"
import { StatusContent } from "@/components/status-content"
import { TextLink } from "@/components/site/link"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="min-h-svh">
      <PenProvider color="rust">
        <SiteHeader lang="en" />
        <StatusContent
          kicker="404"
          head="This page doesn’t exist."
          body="The link may be broken, or the page may have moved. Let’s get you back to something that does exist."
        >
          <p className="mt-[26px] flex min-h-11 items-center">
            <TextLink href="/">Back home</TextLink>
          </p>
          <RecoveryLinks lang="en" />
        </StatusContent>
        <SiteFooter lang="en" column="wide" />
      </PenProvider>
    </div>
  )
}
