/**
 * Keeps a presentation in the site's old warm-paper register (Newsreader at
 * 16px on #f5f2ea, no top fade) after the redesign moved the site to Inter on
 * benji's ground. `.deck-legacy` is `display: contents`, so it adds no box; it
 * only resets what the decks inherit. See the "legacy deck scope" block in
 * app/globals.css.
 */
export function DeckLegacy({ children }: { children: React.ReactNode }) {
  return <div className="deck-legacy">{children}</div>
}
