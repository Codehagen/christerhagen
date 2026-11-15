import type { Piece } from "../../types"

import OnePenThreeMarks from "./21-one-pen-three-marks"
import OnlyTheNumbers from "./22-only-the-numbers"
import TheAuthorsPass from "./23-the-authors-pass"
import ThePenInNorwegian from "./24-the-pen-in-norwegian"
import SignedAtTheBottom from "./25-signed-at-the-bottom"

/**
 * Round 2, group e — the pen on whole posts. Every piece is 11's page (benji's
 * ground, the lighter band, the grey rail, the 44cqw column) with the kept pen
 * marks — 01's bracket, 03's ring and arrow, 05's highlighter — carried across
 * a full post in one colour. Order is display order.
 */
export const pieces: Piece[] = [
  {
    n: 21,
    title: "One pen, three marks, in reading order",
    take: "11's Docdir page with 01's bracket, 03's ring and arrow and 05's highlighter in one blue, pushed so each mark waits for its own paragraph to scroll into reading position and stays once drawn.",
    Component: OnePenThreeMarks,
  },
  {
    n: 22,
    title: "Only the numbers",
    take: "03's ring and arrow applied to every figure in the apparel post, date line included, pushed with 05's step-back so all the words go grey and only the numbers stay in ink, each with one dry red line of context the site already states.",
    Component: OnlyTheNumbers,
  },
  {
    n: 23,
    title: "The author's pass",
    take: "The Bodø post with exactly one kept mark per paragraph (ring, highlighter, bracket) in green, pushed by putting one control in 11's band that takes the pen away and gives it back, so the clean and marked page can be compared.",
    Component: TheAuthorsPass,
  },
  {
    n: 24,
    title: "The pen in Norwegian",
    take: "18's EN / NO switch moved into 11's band over the Docdir post, pushed so the teal pen writes in the page's language and its ring and highlighter lift and land again on the same phrases in the other language's text.",
    Component: ThePenInNorwegian,
  },
  {
    n: 25,
    title: "Signed at the bottom",
    take: "11's Bodø page left unmarked until the last line, where 01's write-in signs and dates it and 17's copy control becomes the address in the same hand, with a pen tick for copied.",
    Component: SignedAtTheBottom,
  },
]
