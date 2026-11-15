import type { Piece } from "../../types"

import ThePortfolio from "./51-the-portfolio"
import ThePortfolioInHand from "./52-the-portfolio-in-hand"
import DocdirOnTheWall from "./53-docdir-on-the-wall"
import BedriftyWalksOn from "./54-bedrifty-walks-on"
import ThePortfolioPreviews from "./55-the-portfolio-previews"

/** Round 3, group "k": the portfolio and company pages, finished. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 51,
    title: "The portfolio",
    take: "36's header with Portfolio ringed, 08's year ledger and 38's footer on one scrolling page, with 31's red ring and margin note resting on Docdir's sale and moving to any row you point at, then coming back.",
    Component: ThePortfolio,
  },
  {
    n: 52,
    title: "The portfolio in the hand",
    take: "The same page at phone width with 40's menu (teal ring on Portfolio, EN / NO under the list), choosing to unfold a tapped row in place, ring and pen note beneath it, because a phone has no margin for the pen.",
    Component: ThePortfolioInHand,
  },
  {
    n: 53,
    title: "Docdir, with the product on the wall",
    take: "29's company page with one green ring on Acquired, then 13's grid wall used only as a full-width stage where the sales prospectus settles onto the lines, ahead of the story, 19's read next and 38's footer.",
    Component: DocdirOnTheWall,
  },
  {
    n: 54,
    title: "Bedrifty, and the walk on",
    take: "An active company's page where the rust ring marks Building instead of an ending, the story's company names are 07's colourless links with a margin card, and following one or 19's read next turns the page to that company with the ring on its own fact.",
    Component: BedriftyWalksOn,
  },
  {
    n: 55,
    title: "The portfolio, previewed",
    take: "The portfolio grouped as the site groups it, choosing 07's margin card over a pen note when you point at a row (role, year, sector and the company's own words), with the blue pen ringing only Docdir's Acquired.",
    Component: ThePortfolioPreviews,
  },
]
