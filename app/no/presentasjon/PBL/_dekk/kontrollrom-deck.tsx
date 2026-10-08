"use client"

// Det valgte dekket: Kontrollrom-layouten på motoren, uten velgeren.

import { Deck } from "./engine"
import { KontrollromStage } from "./kontrollrom"

export function KontrollromDeck() {
  return <Deck Stage={KontrollromStage} storageKey="deck:pbl" />
}
