import type { Piece } from "../../types"

import Home from "./46-home"
import HomePhone from "./47-home-phone"
import About from "./48-about"
import Writing from "./49-writing"
import OnePage from "./50-one-page"

/** Round 3, group "j": home, about and writing as finished pages. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 46,
    title: "Home, as shipped",
    take: "26's home under 36's header with 02's rail, 07's previews on the about paragraph, 32's ledger with the newest under a blue wash and 38's footer as the contact; the one choice is that home rings nothing (the name is where you are), so the pen's only work on the page is the wash on the newest post.",
    Component: Home,
  },
  {
    n: 47,
    title: "Home on a phone",
    take: "46's home at phone width with 40's menu, 07's links and 38's footer; the one choice is that 02's rail folds into the menu, so the teal ring marks the section you are reading and travels to the one you tap before the page scrolls there.",
    Component: HomePhone,
  },
  {
    n: 48,
    title: "About, every name a preview",
    take: "28's about page under 36's header with About ringed and 02's rail, every company the bio names one of 07's colourless links; the one choice is that the red wash greys the page for its one sentence, and pointing at any name brings the page back to read it.",
    Component: About,
  },
  {
    n: 49,
    title: "The writing index",
    take: "32's ledger as the whole page under 36's header with Writing ringed, grouped by year with 02's rail down the years; the one choice is that every row is 19's read-next line, where only the arrow moves and takes the rust, and the newest sits under the rust wash.",
    Component: Writing,
  },
  {
    n: 50,
    title: "The whole site, one page",
    take: "26's home, 28's about and 32's ledger as one long page with 07's links and 38's footer; the one choice is that with no other pages the band keeps only the name and EN / NO, and 36's ring moves into 02's rail to mark the section you are reading.",
    Component: OnePage,
  },
]
