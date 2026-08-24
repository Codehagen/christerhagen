import type { Metadata } from "next"

import { PresentationLab } from "./presentation-lab"

export const metadata: Metadata = {
  title: "Presentasjonslaboratorium",
  description: "Visuelt laboratorium for Christer Hagens presentasjoner.",
  robots: { index: false, follow: false },
}

export default function PresentationLabPage() {
  return <PresentationLab />
}
