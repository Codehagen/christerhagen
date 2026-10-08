import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prototypen · Slik bygger du et AI-native selskap",
  description: "Tre layouter for samme foredrag, laget med AI. Bytt med 1, 2 og 3.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
