import type { Piece } from "../../types"

import TheDocumentAsFigure from "./69-the-document-as-figure"
import TheNumberAsFigure from "./70-the-number-as-figure"
import TheClipping from "./71-the-clipping"
import TheDistance from "./72-the-distance"
import TheDealSheet from "./73-the-deal-sheet"

/** Round 5, group "o": figures that are ours, each inside the long post page. Order is display order. */
export const pieces: Piece[] = [
  {
    n: 69,
    title: "The document as figure",
    take: "Replaces benji's grey stage with a live demo (and 44's grid wall) with the document itself: the sales prospectus Docdir checked, drawn as two sheets of paper lying on the ground, the pen ringing its one line that was Docdir's (quality-checked), the caption left-aligned under the sheet instead of centred.",
    Component: TheDocumentAsFigure,
  },
  {
    n: 70,
    title: "The number as figure",
    take: "Replaces benji's picture-of-an-interface figure with a figure made of a number: Refenze's 25% set large and tabular in the column between hairlines, its source line as the caption, and the pen ringing the unit (a month) with the site's own caveat in the margin.",
    Component: TheNumberAsFigure,
  },
  {
    n: 71,
    title: "The clipping",
    take: "Replaces benji's illustrative stage with evidence: Avisa Nordland's piece on the sale as a scissor-cut newspaper clipping on the ground, headline verbatim and its text left as grey newsprint, the pen ringing the fact (Solgt) from the column beside it, and the caption linking to the article.",
    Component: TheClipping,
  },
  {
    n: 72,
    title: "The distance",
    take: "Replaces benji's demo stage with the Bodø post's own fact drawn by hand: Oslo to Bodø as one pen line with a loop at each end, north up, 1,200 km set beside it in ink, no map, no tiles.",
    Component: TheDistance,
  },
  {
    n: 73,
    title: "The deal sheet",
    take: "Replaces benji's stage with a term-sheet ledger of the real outcome (Docdir to Broker AS, part of Visma, early 2026; Visma's Bodø purchases, PowerOffice 1 and Docdir 2), tabular and cardless on the ground, with one pen ring on the 2 and a tick out to the margin.",
    Component: TheDealSheet,
  },
]
