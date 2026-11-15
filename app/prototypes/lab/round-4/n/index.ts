import type { Piece } from "../../types"

import ThePhotoMovesDown from "./65-the-photo-moves-down"
import ThePhotoOnTheWall from "./66-the-photo-on-the-wall"
import ThePhotoAsTheSignature from "./67-the-photo-as-the-signature"
import TodayForComparison from "./68-today-for-comparison"

/** Round 4, group "n": the about page, one decision about the photo each. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 65,
    title: "About, the photo moves down",
    take: "The about page opens on the headline and the bio with nothing above them, and the working photo sits further down as a small figure beside Background with a grey caption; it costs the face on arrival, so a visitor reads who he is before seeing him.",
    Component: ThePhotoMovesDown,
  },
  {
    n: 66,
    title: "About, the photo on the wall",
    take: "The portrait becomes a white-bordered print on 13's grid wall, settling onto its lines after the first paragraph with one green note beside it, and the wall is the only place the photo may live; it costs the photo its ease, since a framed print reads as an exhibit rather than a person.",
    Component: ThePhotoOnTheWall,
  },
  {
    n: 67,
    title: "About, the photo as the signature",
    take: "No photo anywhere in the column: the page ends with a small portrait cropped to the face beside the name, where he is and the copy address, like a sign-off; it costs being seen at all for anyone who stops reading before the end.",
    Component: ThePhotoAsTheSignature,
  },
  {
    n: 68,
    title: "For comparison: today's about, in the kept frame",
    take: "Today's about layout, the working photo in the site's 280 × 360 crop at the top of the page, under the headline with the bio wrapping round it, set unchanged in the kept frame so 65–67 can be read against it; it costs the near-white ground its first impression, since the dark photo is the first thing seen.",
    Component: TodayForComparison,
  },
]
