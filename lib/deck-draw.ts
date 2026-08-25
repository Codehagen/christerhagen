import { visualPalettes } from "@/lib/deck-visual"

/**
 * Primitivene alle presentasjonens illustrasjoner deler. Tre kopier av samme
 * blekkstrek er nøyaktig sånn et visuelt språk slutter å være ett språk.
 */

export const deckPaper = visualPalettes.papir
export const deckInk = deckPaper.primary
export const deckRust = deckPaper.secondary
export const deckGround = deckPaper.ground

/** Fire streker som krysser i hjørnene — sånn tegner en plotter en boks. */
export function boxPath(x: number, y: number, w: number, h: number, overshoot = 2.5) {
  const o = overshoot
  return [
    `M ${x - o} ${y} H ${x + w + o}`,
    `M ${x + w} ${y - o} V ${y + h + o}`,
    `M ${x + w + o} ${y + h} H ${x - o}`,
    `M ${x} ${y + h + o} V ${y - o}`,
  ].join(" ")
}
