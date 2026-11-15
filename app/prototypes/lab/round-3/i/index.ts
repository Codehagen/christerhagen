import type { Piece } from "../../types"

import ThePostPage from "./41-the-post-page"
import ThePostOnAPhone from "./42-the-post-on-a-phone"
import ThePenOnRequest from "./43-the-pen-on-request"
import OneShotOnTheWall from "./44-one-shot-on-the-wall"
import ReadNextIsTheLastMark from "./45-read-next-is-the-last-mark"

/** Round 3, group "i": the finished post page. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 41,
    title: "The post page",
    take: "36's header, 02's rail, 21's three marks in reading order with 23's switch at the foot of the rail, 19's read next and 38's footer assembled into the Docdir post as it would ship, choosing to add nothing else.",
    Component: ThePostPage,
  },
  {
    n: 42,
    title: "The post on a phone",
    take: "The same parts at phone width for the Bodø post in Norwegian, choosing to keep everything but move it: 02's rail laid on its side under the band, the pen's notes written under the paragraph instead of beside it, and 40's menu holding the ringed page, EN / NO and 23's switch.",
    Component: ThePostOnAPhone,
  },
  {
    n: 43,
    title: "The pen on request",
    take: "The finished apparel post with 23's toggle turned around: the pen starts off, and its only trace is one line in the margin, level with the title, offering the notes; ask, and 21's three marks draw in reading order.",
    Component: ThePenOnRequest,
  },
  {
    n: 44,
    title: "One shot on the wall",
    take: "The finished Docdir post in Norwegian with 13's grid wall used as it was asked back, a stage inside the column holding the one product shot (the sales prospectus) that settles onto its lines, its checks in the pen's own green.",
    Component: OneShotOnTheWall,
  },
  {
    n: 45,
    title: "Read next is the last mark",
    take: "The finished Bodø post where the pen, after its three marks, makes one more at the end: a line in the margin about the next post and an arrow back to 19's read next, whose arrow takes the ink.",
    Component: ReadNextIsTheLastMark,
  },
]
