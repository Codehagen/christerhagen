import type { Piece } from "../../types"

import LinkPiece from "./16-link"
import CopyEmail from "./17-copy-email"
import Language from "./18-language"
import ReadNext from "./19-read-next"
import PenRing from "./20-pen-ring"

/** Round-1 "d": small things you can touch, one control on a quiet stage. */
export const pieces: Piece[] = [
  {
    n: 16,
    title: "The link itself",
    take: "Took benji's colourless link (ink text, a from-font hairline underline) and made the line the whole design: hover only warms the underline to blue, a browser-style status line shows where it goes, and a toggle lays the real hit areas bare.",
    Component: LinkPiece,
  },
  {
    n: 17,
    title: "Copy the address",
    take: "Took the plain underlined address and gave it one quiet copy button whose glyph turns into a self-drawing green check for 1.5s before handing the button back, with a select-and-⌘C fallback when the clipboard says no.",
    Component: CopyEmail,
  },
  {
    n: 18,
    title: "EN / NO",
    take: "Kept the site's switch as small as benji keeps his rail, two letters and a slash in ink and grey, and pushed it into a hand-off: the teal underline leaves one letter for the other while the contact page re-sets itself in Norwegian.",
    Component: Language,
  },
  {
    n: 19,
    title: "Read next",
    take: "Took the hairline-and-grey-label close of a post and allowed exactly one thing to move and carry colour, the arrow; following it turns the page so the next title slides in under the line.",
    Component: ReadNext,
  },
  {
    n: 20,
    title: "The pen ring",
    take: "Turned benji's single hand-circled “New” into a pen you can move: the ring draws itself around New once seen, leaves to circle whatever title you point at or focus, and a click sets it down.",
    Component: PenRing,
  },
]
