import type { Piece } from "../../types"

import TheWholeChrome from "./56-the-whole-chrome"
import AtPhoneWidth from "./57-at-phone-width"
import ContactIsTheFooter from "./58-contact-is-the-footer"
import ThePenInTheHeader from "./59-the-pen-in-the-header"
import NotFound from "./60-not-found"

export const pieces: Piece[] = [
  {
    n: 56,
    title: "The whole chrome, at desktop width",
    take: "36's travelling ring and quiet EN / NO, 02's 40% rail, 38's address footer and 19's read next on every real page; the one choice is that on a post the rail becomes the list of posts under ↩ All writing while the header ring stays on Writing.",
    Component: TheWholeChrome,
  },
  {
    n: 57,
    title: "The same system at phone width",
    take: "40's menu with the ring, 36's quiet EN / NO and 38's address footer at phone width; the one choice is no rail on a phone, so the menu holds only the pages and the language and every page still ends on the address.",
    Component: AtPhoneWidth,
  },
  {
    n: 58,
    title: "Contact is the footer, grown",
    take: "17/38's address and copy with 36's header; the one choice is that Contact is not its own page but the footer growing to fill the frame, the address getting bigger where it already was, with the socials and what he looks for opening under it.",
    Component: ContactIsTheFooter,
  },
  {
    n: 59,
    title: "The pen is a site-wide setting",
    take: "23's hide-the-pen moved into 36's header beside EN / NO, over one 05 highlighter or 01 bracket per post and 26's ring on New; the one choice is that turning it off removes every note on every page but keeps the header ring, because that says where you are, not what he thinks.",
    Component: ThePenInTheHeader,
  },
  {
    n: 60,
    title: "The page that isn't there",
    take: "The site's 404 word for word inside 36's header and 38's footer; the one choice is that the header shows no ring because there is no current page, and the pen draws one arrow up to the name, which always goes home.",
    Component: NotFound,
  },
]
