import { redirect } from "next/navigation"

import { defaultSlug } from "@/lib/companies"

// The Portfolio listing page is a separate design (Portfolio.dc.html) and not yet
// implemented. Until then, /portfolio resolves to the first company — matching the
// source's default of showing "codebase" when no company is selected.
export default function PortfolioIndex() {
  redirect(`/portfolio/${defaultSlug}`)
}
