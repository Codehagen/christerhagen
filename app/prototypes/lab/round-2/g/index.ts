import type { Piece } from "../../types"

import HowItEnded from "./31-how-it-ended"
import WritingLedger from "./32-writing-ledger"
import PhoneLedger from "./33-phone-ledger"
import StruckSunset from "./34-struck-sunset"
import TheNumbers from "./35-the-numbers"

export const pieces: Piece[] = [
  {
    n: 31,
    title: "How it ended",
    take: "08's year ledger with 20's moving pen ring in the outcome column and 10's margin note, so pointing at any of the twelve rows rings its outcome and the pen says how it ended.",
    Component: HowItEnded,
  },
  {
    n: 32,
    title: "The writing, as a ledger",
    take: "The posts set like 08 (year once, title, read time, dd/mm) with 05's highlighter on the newest and 18's EN / NO doing one real thing: the ledger re-sets in Norwegian and the pen sweeps again.",
    Component: WritingLedger,
  },
  {
    n: 33,
    title: "The ledger at phone width",
    take: "10's now / before index in a 375px column, rows stacked so nothing truncates and the years kept in tabular figures, with 01's bracket drawing down the two that came before.",
    Component: PhoneLedger,
  },
  {
    n: 34,
    title: "Sunset, struck through",
    take: "The Work ledger on 11's ground, where the pen pushes 10's successor line into an editor's mark: Sailsdock's Sunset struck through, a caret, and \"bedrifty, 2026\" written beside it.",
    Component: StruckSunset,
  },
  {
    n: 35,
    title: "The numbers",
    take: "Every figure the site states as one flush-right tabular ledger, with 03's ring and arrow on the top 4%, the arrow pushed down off the ledger so it crosses no row, to say it was the same year Docdir sold.",
    Component: TheNumbers,
  },
]
