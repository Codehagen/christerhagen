import type { Piece } from "../../types"

import RingTravels from "./36-ring-travels"
import OnlyTheBand from "./37-only-the-band"
import FooterIsTheAddress from "./38-footer-is-the-address"
import StrikeAndWrite from "./39-strike-and-write"
import PhoneMenu from "./40-phone-menu"

/** Round 2, group "h": the header and footer as the controls. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 36,
    title: "The pen marks where you are",
    take: "The site header set in 11's white band with 20's red pen ring as the only sign of the current page, pushed so picking another page lifts the ring, slides it and draws it again while the page under it re-sets; the name goes home, where nothing is ringed.",
    Component: RingTravels,
  },
  {
    n: 37,
    title: "Only the band",
    take: "11's top band made the whole header (the name left, 18's EN / NO right, nothing else) over the scrolling Docdir post with 01's bracket note, pushed so the band's edge only appears once the page has moved and a language switch keeps your place in the reading.",
    Component: OnlyTheBand,
  },
  {
    n: 38,
    title: "The footer is the address",
    take: "A footer cut down to 17's email-and-copy and 18's EN / NO under the end of the Bodø post, pushed so the copy check is joined by the pen writing \"copied\" (or \"kopiert\") beside it for the same 1.5 seconds.",
    Component: FooterIsTheAddress,
  },
  {
    n: 39,
    title: "Strike one, write the other",
    take: "18's EN / NO with the underline replaced by the hand from 01 and 03: the language you are not reading is struck through in orange pen and the one you are gets its name written under it, redrawn on every switch while the contact page re-sets.",
    Component: StrikeAndWrite,
  },
  {
    n: 40,
    title: "On a phone, the ring is the menu",
    take: "The site's phone header (name and a menu button in 11's band) with 20's pen ring marking the current item in the open menu, pushed so a tap sends the ring to the new page first and the menu closes a beat later; Esc closes and returns focus.",
    Component: PhoneMenu,
  },
]
