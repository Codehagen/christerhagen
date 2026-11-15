import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PenProvider } from "@/components/site/pen"
import { RecoveryLinks } from "@/components/recovery-links"
import { StatusContent } from "@/components/status-content"
import { TextLink } from "@/components/site/link"

export const metadata: Metadata = {
  title: "Siden finnes ikke",
  robots: { index: false, follow: true },
}

// Norwegian not-found boundary for the /no subtree. Triggers when a /no page
// calls notFound() (e.g. /no/writing/[bad-slug], /no/portfolio/[bad-slug]).
export default function NotFound() {
  return (
    <div className="min-h-svh">
      <PenProvider color="rust">
        <SiteHeader lang="no" />
        <StatusContent
          kicker="404"
          head="Denne siden finnes ikke."
          body="Lenken kan være ødelagt, eller så har siden flyttet. La oss få deg tilbake til noe som finnes."
        >
          <p className="mt-[26px] flex min-h-11 items-center">
            <TextLink href="/no">Tilbake til forsiden</TextLink>
          </p>
          <RecoveryLinks lang="no" />
        </StatusContent>
        <SiteFooter lang="no" column="wide" />
      </PenProvider>
    </div>
  )
}
