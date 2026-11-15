import type { Piece } from "../../types"

import NoFace from "./61-no-face"
import Byline from "./62-the-byline"
import TheNameOpens from "./63-the-name-opens"
import Toned from "./64-toned-to-the-ground"

/** Round 4, group "m": the home page, one decision about the photo each. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 61,
    title: "Home, no face",
    take: "benji's home in the kept frame (the name, one paragraph, the writing, the work) with no photo at all, so nothing dark pulls against the ground; what it costs is that a visitor who came to see who Christer Hagen is never sees him.",
    Component: NoFace,
  },
  {
    n: 62,
    title: "Home, a byline",
    take: "The portrait cut to his face in a circle two lines tall beside the name, the way an author's byline sits, in its own colour; it keeps a face on the page for almost no room, and costs the photo itself: at that size it is a face, not the man in the room.",
    Component: Byline,
  },
  {
    n: 63,
    title: "Home, the name opens",
    take: "The name is a colourless link like the companies under it, and pointing at, focusing or tapping it opens a small card with the portrait; the page stays all words, and the cost is that the face is only seen by someone who goes looking.",
    Component: TheNameOpens,
  },
  {
    n: 64,
    title: "Home, toned to the ground",
    take: "The portrait greyed and lifted (no colour, low contrast, more light) and faded out at the bottom, in the right margin beside the name at a third of the current hero's width; it stays on the page without pulling against the near-white, and costs the warmth that made it his.",
    Component: Toned,
  },
]
