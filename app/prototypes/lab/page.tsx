import { deckFonts } from "@/app/fonts"

import { Lab } from "./lab"

/**
 * The visual lab: a numbered grid for the curation loop.
 *
 * The agent makes many, Christer keeps few, the next round is made from what
 * was kept. Pieces may break the site's current system — finding the next one
 * is the point. See README.md in this folder for how a round is run.
 */
export const metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
}

export default function LabPage() {
  // The lab draws today's site (Newsreader, JetBrains Mono) beside the
  // redesign; the root layout no longer loads those faces.
  return (
    <div className={`contents ${deckFonts}`}>
      <Lab />
    </div>
  )
}
