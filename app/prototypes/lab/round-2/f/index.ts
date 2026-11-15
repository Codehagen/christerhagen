import type { Piece } from "../../types"

import Home from "./26-home"
import PortfolioLedger from "./27-portfolio-ledger"
import AboutOneLine from "./28-about-one-line"
import DocdirPage from "./29-docdir-page"
import ContactEitherTongue from "./30-contact-either-tongue"

/**
 * Round 2, group "f": the site's pages assembled on benji's ground. Each is a
 * whole miniature page on piece 11's frame (ground, empty band, fixed rail,
 * centred column), scrollable inside the tile, with one pen. Display order.
 */
export const pieces: Piece[] = [
  {
    n: 26,
    title: "The home page, one pen",
    take: "Piece 11's frame with the rail as the home page's sections, the work as 10's now/before ledger, and 20's blue pen ring on the writing list, pushed so the page glides itself down to the list and the ring circles New once it arrives.",
    Component: Home,
  },
  {
    n: 27,
    title: "The portfolio is one ledger",
    take: "08's year ledger as the whole portfolio page, pushed so 11's rail becomes the All / Built / Backed filter and a green pen ring (20) and margin note (01) mark the one sale, who bought it, and that it was Bodø's second.",
    Component: PortfolioLedger,
  },
  {
    n: 28,
    title: "About, in one line",
    take: "05's highlighter on the about page's last sentence — the best companies can be built far from the capital — pushed to a whole scrolling page whose photo, timeline ledger and press list all step back to grey once the line is swept.",
    Component: AboutOneLine,
  },
  {
    n: 29,
    title: "Docdir, ringed",
    take: "A single company page with its facts as a right-aligned ledger, pushed by moving 03's measured red ring and arrow from prose onto the fact \"Acquired\", carried to one margin line: by Visma, the second from Bodø after PowerOffice.",
    Component: DocdirPage,
  },
  {
    n: 30,
    title: "Contact, in either tongue",
    take: "17's copy button and 18's EN / NO assembled into the whole contact page on 11's ground, pushed so the switch mirrors the rail across the frame and re-sets everything (nav, copy labels, socials, the teal pen note) in the other language.",
    Component: ContactEitherTongue,
  },
]
