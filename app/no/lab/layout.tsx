import { deckFonts } from "@/app/fonts"
import { DeckLegacy } from "@/components/deck-legacy"

/**
 * The presentations keep their own register; see components/deck-legacy.tsx.
 * Newsreader and JetBrains Mono are loaded here, not at the root.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`contents ${deckFonts}`}>
      <DeckLegacy>{children}</DeckLegacy>
    </div>
  )
}
