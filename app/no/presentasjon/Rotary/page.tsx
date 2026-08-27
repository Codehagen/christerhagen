import type { Metadata } from "next"

import { AiITreStegDeck } from "./deck"

export const metadata: Metadata = {
  title: "Fra å spørre til å delegere",
  description:
    "Christer Hagens presentasjon om tre nivåer i AI og erfaringene fra Advanti Estate.",
  robots: { index: false, follow: false },
}

export default function AiITreStegPresentation() {
  return <AiITreStegDeck />
}
