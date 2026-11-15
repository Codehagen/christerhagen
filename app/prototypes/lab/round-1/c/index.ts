import type { Piece } from "../../types"

import BenjiGround from "./11-benji-ground"
import TodaysPaper from "./12-todays-paper"
import TheWallAsGround from "./13-the-wall-as-ground"
import TwoGrounds from "./14-two-grounds"
import PaperGrain from "./15-paper-grain"

/**
 * Group c — ground and frame. Each piece is a miniature whole page of
 * christerhagen.com, so what is being judged is the background, the top band
 * and the rail rather than a component. 11 and 12 are the same page on two
 * grounds, for choosing between them. Order is display order.
 */
export const pieces: Piece[] = [
  {
    n: 11,
    title: "benji's ground, exactly",
    take: "The Docdir post on #FDFDFC with benji's white band a shade lighter than the page and his 40% grey rail, which darkens as you scroll the mini page; pushed by letting a blue pen note bracket the Visma paragraph only once you reach it.",
    Component: BenjiGround,
  },
  {
    n: 12,
    title: "Comparison: today's paper, same frame",
    take: "Exactly 11's band, rail and column, but on the site's current warm paper, Newsreader, JetBrains Mono and rust, so the only thing that changes between 11 and 12 is the ground and the voice.",
    Component: TodaysPaper,
  },
  {
    n: 13,
    title: "The wall as the page",
    take: "benji's 1px demo-stage grid promoted from behind a demo to the whole Docdir portfolio page, with every edge on its lines; drag the sales prospectus and it lands on the grid, the green cell showing where.",
    Component: TheWallAsGround,
  },
  {
    n: 14,
    title: "Two grounds, rail and reading",
    take: "benji's rail given its own ground one step below the reading ground, with the active section marked by a tick on the seam between them; the index (writing by year with dd/mm, portfolio, now) scrolls and a red pen circles the newest post.",
    Component: TwoGrounds,
  },
  {
    n: 15,
    title: "Paper grain, barely",
    take: "benji's band and column on a ground with feTurbulence grain at 5% that you feel rather than see, the band left as the only clean paper; an ochre loupe follows the pointer and shows the same grain turned up.",
    Component: PaperGrain,
  },
]
