import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { AiITreStegDeck } from "./deck"

const presentationFont = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
})

export const metadata: Metadata = {
  title: "Fra å spørre til å delegere",
  description:
    "Christer Hagens presentasjon om tre nivåer i AI og erfaringene fra Advanti Estate.",
  robots: { index: false, follow: false },
}

export default function AiITreStegPresentation() {
  return (
    <div className={presentationFont.className}>
      <AiITreStegDeck />
    </div>
  )
}
