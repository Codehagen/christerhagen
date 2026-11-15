import type { Piece } from "../../types"

import BracketNote from "./01-bracket-note"
import RailContents from "./02-rail-contents"
import CircleArrow from "./03-circle-arrow"
import MarginFootnotes from "./04-margin-footnotes"
import Highlighter from "./05-highlighter"

/** Round 1, group "a": reading and margin notes. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 1,
    title: "Bracket, drawn in",
    take: "benji's pen bracket beside the apparel post's lesson paragraph, pushed so the bracket draws down top to bottom and the blue note then writes itself in left to right.",
    Component: BracketNote,
  },
  {
    n: 2,
    title: "The rail knows",
    take: "benji's fixed left rail at 40% grey with ↩ Index, over a mini page of all three posts you can scroll; the section you are reading darkens and a rust pen arrow slides to it.",
    Component: RailContents,
  },
  {
    n: 3,
    title: "Ring the number",
    take: "The hand-circled \"New\" from benji's list moved into the prose: a red pen rings \"1,200 kilometres\" in the Bodø post and a curved arrow, measured from the real text, carries it to the margin.",
    Component: CircleArrow,
  },
  {
    n: 4,
    title: "Footnotes in the margin",
    take: "Margin notes turned into numbered sidenotes on the Docdir post: green numbers in the text, pen notes aligned to their own line, and pointing at either pairs them.",
    Component: MarginFootnotes,
  },
  {
    n: 5,
    title: "The one sentence",
    take: "A yellow highlighter on the Docdir post's lesson, swept stroke by stroke like a dragged hand, after which the rest of the page steps back to grey so only that line reads.",
    Component: Highlighter,
  },
]
