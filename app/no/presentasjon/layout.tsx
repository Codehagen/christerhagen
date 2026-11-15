import { DeckLegacy } from "@/components/deck-legacy"

/** The presentations keep their own register; see components/deck-legacy.tsx. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DeckLegacy>{children}</DeckLegacy>
}
