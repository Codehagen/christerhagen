import type { Round } from "./types"
import { pieces as a } from "./round-1/a"
import { pieces as b } from "./round-1/b"
import { pieces as c } from "./round-1/c"
import { pieces as d } from "./round-1/d"
import { pieces as e } from "./round-2/e"
import { pieces as f } from "./round-2/f"
import { pieces as g } from "./round-2/g"
import { pieces as h } from "./round-2/h"
import { pieces as i } from "./round-3/i"
import { pieces as j } from "./round-3/j"
import { pieces as k } from "./round-3/k"
import { pieces as l } from "./round-3/l"
import { pieces as m } from "./round-4/m"
import { pieces as n } from "./round-4/n"

/**
 * Newest round first. Earlier rounds stay on the page: the lab is the record of
 * what was kept and what was thrown away, and the skill that comes out of it
 * is written from both.
 */
export const ROUNDS: Round[] = [
  {
    id: "round-4",
    title: "Round 4 — the photo, home and about",
    note: "Round 3 kept 41, 42, 44, 45 (posts), 49 (writing), 51, 55 (portfolio) and 53 (Docdir) and none of the pages with the photo (46, 47, 48, 50). Christer asked whether the photo should be updated or moved somewhere else. Both photos are dark and warm and pull against the near-white ground, and benji.org has none. So this round is only home and about, in the frame of the kept pages, each piece making one decision about the photo: none at all, a small byline, only on about, behind a hover on the name, toned to sit on the ground, on the grid-wall stage, at the end as a signature, and the site's current hero for comparison.",
    pieces: [...m, ...n].sort((x, y) => x.n - y.n),
  },
  {
    id: "round-3",
    title: "Round 3 — whole pages, converging",
    note: "Made only from what was kept after round 2: 01, 02, 05, 07, 08, 13, 17, 19, 21, 22, 23, 26, 28, 29, 31, 32, 36, 38, 40. Read: whole pages beat isolated gestures; the pen is the voice but restrained (a bracket that draws down, a highlighter that greys the rest, one ring only where it carries a fact, a toggle to hide it); navigation came back once it sat inside a full page (the 40% rail, read next, the ringed current page in the header, the phone menu); facts as ledgers whose rows explain how they ended; links without colour that preview; copy the address in the footer. Dropped: the free-roaming ring (20), strike-throughs (34, 39), EN/NO as a feature (18, 24, 30, 39 — it stays as two quiet letters in the header, as in 36), the signature (25), the numbers column (35), the bare band (37). The ground stays near-white; 13's grid wall is tested as a stage for product shots, not the page. Each piece is a finished page, desktop and phone: posts (41–45), home, about and writing (46–50), portfolio and company pages (51–55), the chrome around every page (56–60).",
    pieces: [...i, ...j, ...k, ...l].sort((x, y) => x.n - y.n),
  },
  {
    id: "round-2",
    title: "Round 2 — the pen on benji's ground",
    note: "Made only from what round 1 kept: 01, 03, 05, 08, 10, 11, 17, 18, 20. What they share: benji's ground exactly (#FDFDFC, the lighter top band, no grain, no grid, no second ground), and a hand that marks the page (a bracket that draws down, a ring with an arrow to the margin, a highlighter sweep that greys the rest, a ring that moves to what you point at), one pen colour per piece. Facts as quiet ledgers (year, name, role, outcome; now and before). Controls that do one real thing (copy, EN/NO). Dropped: the table of contents as the star (02, 14), sidenotes (04), previews on hover (07), the ruler (09), today's paper (12), the grid wall (13), grain (15), the bare link (16), read next (19). Four axes: the pen on whole posts (21–25), the site's pages assembled on that ground (26–30), ledgers that carry the pen (31–35), the header and footer as the controls (36–40).",
    pieces: [...e, ...f, ...g, ...h].sort((x, y) => x.n - y.n),
  },
  {
    id: "round-1",
    title: "Round 1 — benji.org, for christerhagen.com",
    note: "Reference: benji.org and its /stageshow post, by way of the Quincy lab register (near-white ground, grey stages, Inter 14px, hierarchy by weight and grey, a pen in the margin, one accent per piece). Subjects are Christer's own: the posts, the companies, Bodø. Four axes: reading and margin notes (01–05), the index — writing and companies as lists (06–10), ground and frame — the background, the top band, the rail (11–15), small things you can touch (16–20).",
    pieces: [...a, ...b, ...c, ...d].sort((x, y) => x.n - y.n),
  },
]
