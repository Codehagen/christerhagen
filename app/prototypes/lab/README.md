# The lab

A numbered grid for finding christerhagen.com's next visual style. Ported from
the Quincy lab (`quincy/app/prototypes/lab`), whose styling Christer rated 10/10.
The method:

1. The agent makes many pieces (20 a round), genuinely different from each other.
2. Christer ticks the ones to keep and presses **Copy picks** (`Keep: 03, 07, 12`).
3. The next round is made from only what was kept: keep what they share, drop
   everything that was not picked. It goes on the page as a new section; earlier
   rounds stay.
4. Once the style holds, an agent writes a skill / DESIGN.md from the lab: real
   values for type, line-work, spacing, colour, motion and structure, the reason
   for each, and what does not belong (read from what was discarded).

## References

- Round 1: https://benji.org and https://benji.org/stageshow — chosen by
  Christer on 2026-11-15. What we read off it: ground #FDFDFC, ink #111, Inter
  14/20 at weight 460 and −0.09px tracking, a ~550px column, links with no
  colour, the writing list grouped by year with dd/mm right-aligned, one
  hand-circled "New", a fixed left rail (13px, 40% grey, active item darkens,
  "↩ Index" above), section headings with a hairline running right, and
  handwritten margin notes in his own script font with a bracket that draws in.

## Rules for a piece

- Lives in `round-N/<group>/NN-slug.tsx`, default-exported, and listed in that
  group's `index.ts` as a `Piece`. `n` is permanent; a discarded number is
  never reused.
- Owns its whole 4:3 frame, including its background. Build from `../../kit`
  (Tile, Lead, Bar, Bracket, useSeen, C, RING, fontHand, fontMono, fontSerif).
  Do not import from `components/` or use the site's tokens (`--paper`,
  `--rust`, `bg-background` …) — except where a piece's stated purpose is to
  test the site's current paper/Newsreader/rust against the benji register.
- Exactly one accent colour per piece. Everything else is neutrals.
- Subjects are Christer's real things (read `lib/posts.ts`, `lib/companies.ts`,
  `components/about-content.tsx`): never lorem, never invented facts.
- All sizes in `cqw` so a piece reads the same at 560px and 360px wide.
- Motion: CSS transitions naming their properties for interactive state,
  keyframes only for one-shots and loops, and a `prefers-reduced-motion` path.
- Fonts come from `../../fonts` (Inter, the pen) or the root layout
  (`fontSerif`, `fontMono`). Never call a `next/font` loader in a piece.
- Round 2 (2026-11-15): kept from round 1 → 01, 03, 05, 08, 10, 11, 17, 18,
  20. Read: the pen is the voice; benji's ground wins over the current warm
  paper; facts as ledgers; controls that do one real thing.
- Round 3 (2026-11-15): kept after round 2 → 01, 02, 05, 07, 08, 13, 17, 19,
  21, 22, 23, 26, 28, 29, 31, 32, 36, 38, 40. Read: whole pages win; the pen
  is restrained; navigation returns inside full pages; EN/NO stays quiet.
- Round 4 (2026-11-15): kept after round 3 → 41, 42, 44, 45, 49, 51, 53, 55.
  No photo page was kept; Christer asked to update or move the photo. Round 4
  is home + about only, one photo decision per piece.
- Round 5 result (2026-11-15): kept 69, 70, 71, 72, 77 (document, number,
  clipping and distance as figures; the facts margin). Written into
  DESIGN.md §4 "Long posts".
