import type { Metadata } from "next"

import { KontrollromDeck } from "./_dekk/kontrollrom-deck"

export const metadata: Metadata = {
  title: "Slik bygger du et AI-native selskap",
  description:
    "Christer Hagens foredrag for PBL Mentor: Advanti Estate som AI-native selskap, agentene, en kundesamtale som ble en app, og Verid.",
}

export default function PblPresentation() {
  return <KontrollromDeck />
}
