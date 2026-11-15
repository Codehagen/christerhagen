import type { Piece } from "../../types"

import TheYearsAsTheRail from "./74-the-years-as-the-rail"
import SourcesNotFootnotes from "./75-sources-not-footnotes"
import ThePensSummary from "./76-the-pens-summary"
import TheFactsMargin from "./77-the-facts-margin"
import TheBilingualAside from "./78-the-bilingual-aside"

/** Round 5, group "p": structure that is ours. Long posts in the settled frame, one benji device replaced each. */
export const pieces: Piece[] = [
  {
    n: 74,
    title: "The years as the rail",
    take: "Replaces benji's rail of section titles and his hairline headings with time: a long post built from the timeline and the company stories, whose rail lists 2016, 2017, 2021, 2024, 2026 and whose sections each open on the year in ink with the timeline's own line in grey beside it; the pen ticks only the last year.",
    Component: TheYearsAsTheRail,
  },
  {
    n: 75,
    title: "Sources, not footnotes",
    take: "Replaces benji's superscript footnotes with sources: a claim the press reported carries the outlet's name as a small grey tag, which takes you to a Sources ledger at the end (outlet, headline ↗, the way back) and lights that row in the pen's wash; the rest of the press list follows, and there are no numbers anywhere.",
    Component: SourcesNotFootnotes,
  },
  {
    n: 76,
    title: "The pen's summary",
    take: "Replaces benji's table of contents with two things of ours: before the text, the pen has bracketed the opening and written the post in three lowercase lines in the margin, and the rail says how many minutes are left instead of naming sections.",
    Component: ThePensSummary,
  },
  {
    n: 77,
    title: "The facts margin",
    take: "Replaces benji's margin commentary with a running ledger: as each part comes into view its companies join a margin list with year and stage, the part you are reading in ink and the ones behind you in grey, with the pen's one ring on Docdir's \"Acquired\".",
    Component: TheFactsMargin,
  },
  {
    n: 78,
    title: "The bilingual aside",
    take: "Replaces benji's margin commentary with the site's two languages: in an English post the pen writes, level with the line, the Norwegian word the site's own NO copy uses (salgsoppgave = sales prospectus, meglere = agents), and in Norwegian it writes the English back.",
    Component: TheBilingualAside,
  },
]
