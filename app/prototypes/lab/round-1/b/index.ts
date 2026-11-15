import type { Piece } from "../../types"

import WritingIndex from "./06-writing-index"
import AboutPreviews from "./07-about-previews"
import YearTable from "./08-year-table"
import Ruler from "./09-ruler"
import NowBefore from "./10-now-before"

export const pieces: Piece[] = [
  {
    n: 6,
    title: "The writing index",
    take: "Benji's homepage almost verbatim (name and Updated in grey, colourless underlined links, writing by year with dd/mm right), pushed by letting the pen ring draw itself in and redraw on tap, and by quieting the other rows on hover.",
    Component: WritingIndex,
  },
  {
    n: 7,
    title: "Links that preview",
    take: "Takes the colourless, fine-underlined link from benji's about paragraph and pushes it into a small card under the hovered name, so the link explains itself without leaving the page.",
    Component: AboutPreviews,
  },
  {
    n: 8,
    title: "The portfolio ledger",
    take: "Takes the year-only-on-the-first-row grouping and the hairline rows from benji's writing list and turns them on the twelve companies as a tabular-figure table, with the one sale as the only colour.",
    Component: YearTable,
  },
  {
    n: 9,
    title: "Ten years on a ruler",
    take: "Takes benji's grey-and-ink hierarchy and hairlines and lays the companies on a draggable year ruler, where whatever was running in the chosen year darkens and everything else stays grey.",
    Component: Ruler,
  },
  {
    n: 10,
    title: "Now, and before",
    take: "Takes the plain index and the handwritten margin note with its drawn line, and splits the list in two so every finished company keeps a pen note on how it ended, Sailsdock's drawn up to Bedrifty.",
    Component: NowBefore,
  },
]
