# christerhagen.com design system

Read this before you build or change any page. Every value here was read off the curation lab at
`app/prototypes/lab` (start with its `README.md` and `rounds.ts`). If a value is not in this file,
check the lab piece it names. Do not invent a new one.

## 1. What this is

The redesign comes from benji.org (Benji Taylor's site), by way of the Quincy lab. It uses a near-white ground,
ink type, Inter at 14/20, and hierarchy made from weight and grey instead of size and colour. Links have no colour. Facts are set
as quiet ledgers. One hand, "the pen", marks the page in Christer's own voice. Christer curated it over
four rounds of numbered pieces (`/prototypes/lab`). The final set: posts 41, 42, 44, 45; writing 49;
portfolio 51 and 55; company 53; home 64; about 67. Those pages are built from round-1 pieces 01, 03, 05, 08, 10, 11, 17, 18 and 20
and round-2 pieces 21, 31, 33, 34, 35 and 37. Pieces 18, 20, 34, 35 and 37 are **secondary vocabulary**: allowed, never the point of a page.

## 2. Tokens

### Conversion rule (lab `cqw` → real px)

A lab page frame is 100cqw wide. Final pieces set body text at **2.15cqw**, and that 2.15cqw is benji's 14px. Two rules follow:

- **Type and everything sized against text** (font sizes, leading, gaps inside components, stroke offsets,
  header height, row padding): `px = cqw × 14 / 2.15 ≈ cqw × 6.5`. Put another way, `em = cqw / 2.15`.
- **Page placement** (column offset and width, rail left, side padding, margin widths): `cqw` is a
  percentage of the page width, capped at a 1200px page (`1cqw = 12px` at 1200).

The kit's note says "1cqw ≈ 5.6px, 2.5cqw is the 14px body". That holds only for the round-1/2 `Tile` pieces (body 2.5cqw).
Do not use it for the final pages: it would put their body text at 12px.

### Grounds: identical to benji.org

Measured on benji.org/stageshow (2026-11-15): html background `rgb(253,253,252)`, ink `rgb(17,17,17)`, no texture.
The lighter strip at the top is **not a band**. It is a `position: fixed` pseudo-element, 128px tall, full width, `z-index: 9`,
`pointer-events: none`, painted with an *eased* white-to-transparent gradient (`--top-fade` below). Content scrolls up and
dissolves under it. There is no edge line.
**`--ground` is the only ground on the site; `--top-fade` is the only thing painted over it.** Cards and the product sheet are
white *surfaces* that sit on the ground. They are not grounds.

### `:root` (ready to paste)

```css
:root {
  /* primitives */
  --white: #FFFFFF;
  --near-white: #FDFDFC;
  --black-111: #111111;
  --ink-rgb: 18 18 18;              /* every grey is this at an alpha */

  /* grounds (the only two) */
  --ground: var(--near-white);       /* html, body: identical to benji.org */
  /* the fixed top fade, copied verbatim from benji.org (128px, eased, no edge line) */
  --top-fade-h: 128px;
  --top-fade: linear-gradient(rgb(255 255 255) 0px, rgb(255 255 255 / 0.737) 19%, rgb(255 255 255 / 0.54) 34%,
    rgb(255 255 255 / 0.38) 47%, rgb(255 255 255 / 0.28) 56.5%, rgb(255 255 255 / 0.192) 65%,
    rgb(255 255 255 / 0.125) 73%, rgb(255 255 255 / 0.075) 80.2%, rgb(255 255 255 / 0.043) 86.1%,
    rgb(255 255 255 / 0.02) 91%, rgb(255 255 255 / 0.008) 95.2%, rgb(255 255 255 / 0.004) 98.2%, rgb(255 255 255 / 0));
  /* usage: body::before { content:""; position:fixed; inset:0 0 auto; height:var(--top-fade-h);
     background:var(--top-fade); pointer-events:none; z-index:9 } */

  /* ink */
  --ink: var(--black-111);
  --ink-muted: rgb(var(--ink-rgb) / 0.5);    /* secondary text, rule labels, meta */
  --ink-idle: rgb(var(--ink-rgb) / 0.4);     /* rail + nav at rest (benji's 40%) */
  --ink-faint: rgb(var(--ink-rgb) / 0.3);    /* tertiary: dates, counts, inactive EN/NO */
  --ink-stepped-back: rgb(var(--ink-rgb) / 0.32); /* the rest, once the highlighter lands */
  --ink-ledger-dim: rgb(var(--ink-rgb) / 0.78);   /* portfolio names not under the ring */

  /* lines */
  --hairline: rgb(var(--ink-rgb) / 0.09);    /* row dividers, footer top, read-next top */
  --rule: rgb(var(--ink-rgb) / 0.14);        /* first row of a ledger group, totals line */
  --underline: rgb(var(--ink-rgb) / 0.22);   /* colourless link underline at rest */
  --slash: rgb(var(--ink-rgb) / 0.22);       /* the "/" in EN / NO */
  --wall-line: rgb(0 0 0 / 0.043);           /* the grid wall, Stage only */

  /* states */
  --row-hover: rgb(var(--ink-rgb) / 0.022);
  --control-hover: rgb(var(--ink-rgb) / 0.035);
  --surface: var(--white);                   /* cards, the product sheet */
  --surface-shadow: 0 0 0 1px rgb(var(--ink-rgb) / 0.07), 0 1px 2px rgb(var(--ink-rgb) / 0.04),
    0 10px 28px -10px rgb(var(--ink-rgb) / 0.12);

  /* the pen: one per page, set on <body> or the page root (see §3) */
  --pen-blue: #2B5CD8;
  --pen-teal: #0F766E;
  --pen-green: #178A5A;
  --pen-rust: #C2410C;
  --pen-red: oklch(0.56 0.2 27);
  --pen-rose: #BE123C;
  --pen: var(--pen-blue);
  --pen-wash: color-mix(in oklch, var(--pen) 16%, transparent);
  --pen-tint: color-mix(in oklch, var(--pen) 6%, transparent);   /* copy button, done */
  --pen-ring-30: color-mix(in oklch, var(--pen) 30%, transparent);
  --pen-stroke: 1.5px;        /* rings, travel ring, arrows */
  --pen-stroke-fine: 1.3px;   /* bracket, margin tick */

  /* type */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;  /* font-feature-settings "cv11","ss01" */
  --font-pen: "Caveat", cursive;                                 /* stand-in, see §7 */
  --text-micro: 11px;   /* EN / NO, post date line (0.72em = 10px in lab) */
  --text-small: 12px;   /* meta, excerpts, captions, kicker, copy button, card text (1.75–1.9cqw) */
  --text-ui: 13px;      /* header nav, rail (1.95cqw: benji's 13px rail) */
  --text-body: 14px;    /* 2.15cqw */
  --text-lead: 16px;    /* read-next title, footer address (1.18em–2.6cqw → 15.6–17px) */
  --text-title: 20px;   /* page/post h1 (3.1cqw; portfolio 3.3cqw = 21.5px) */
  --text-title-lg: 24px;/* company name (3.8cqw) */
  --text-pen: 16px;     /* pen notes beside prose (2.5cqw) */
  --text-pen-lg: 21px;  /* pen notes beside ledgers, "copied" (3.1–3.3cqw) */
  --leading-body: 1.43; /* 14/20 */
  --leading-title: 1.18;
  --leading-ui: 1.35;
  --leading-meta: 1.3;
  --leading-pen: 0.98;
  --weight-body: 460;
  --weight-row: 520;    /* ledger titles, footer address */
  --weight-strong: 560; /* name, titles, h1, active EN/NO */
  --tracking-body: -0.0065em;  /* −0.09px at 14 */
  --tracking-title: -0.012em;
  --tracking-ui: -0.006em;
  --tracking-caps: 0.02em;     /* EN / NO, date line */

  /* layout */
  --page-max: 1200px;
  --band-h: 48px;          /* the header row; it sits inside the 128px top fade */
  --header-row: 48px;
  --page-pad-x: clamp(16px, 5vw, 60px);  /* 5cqw */
  --column: 33rem;         /* 528px: 44cqw at 1200, benji's ~550px; pages with a rail */
  --column-left: 28%;      /* 28cqw */
  --column-wide: 40.5rem;  /* 648px: 54cqw; portfolio + company (no rail) */
  --column-wide-left: 16%;
  --rail-left: 4.4%;       /* 4.2–4.6cqw ≈ 52px */
  --rail-width: 15rem;     /* 18–20cqw; must end before the column */
  --rail-top: calc(var(--band-h) + 46px);
  --margin-gap: 22px;      /* column edge → pen note (3.4cqw) */
  --margin-note-w: 230px;  /* 19–21cqw */
  --target: 44px;

  /* spacing (type scale) */
  --space-1: 4px; --space-2: 8px; --space-3: 10px; --space-4: 14px;
  --space-5: 20px; --space-6: 28px; --space-7: 40px; --space-8: 48px; --space-9: 64px;
  --rule-top: 40px;  --rule-bottom: 9px;  --rule-gap: 10px;   /* 6 / 1.4 / 1.6cqw */
  --row-pad-y: 7px;  /* ledger rows, 1.1cqw */
  --para-gap: 1.3em;

  /* motion */
  --ease-pen: cubic-bezier(.45, 0, .25, 1);      /* strokes: ring, arrow, head */
  --ease-loop: cubic-bezier(.45, .05, .25, 1);   /* ring loops, travel ring */
  --ease-write: cubic-bezier(.4, 0, .3, 1);      /* write-in (clip-path) */
  --ease-bracket: cubic-bezier(.55, 0, .25, 1);
  --ease-hl: cubic-bezier(.4, .1, .3, 1);
  --ease-press: cubic-bezier(.2, .8, .3, 1);
  --ease-settle: cubic-bezier(.2, .8, .2, 1);
  --ease-card: cubic-bezier(.2, .7, .2, 1);
  --ease-arrow: cubic-bezier(.3, .8, .3, 1);
  --dur-press: 140ms; --dur-color: 180ms; --dur-rail: 220ms;
  --dur-ring: 640ms; --dur-arrow: 420ms; --dur-head: 160ms;
  --dur-loop: 520ms; --dur-travel: 420ms; --dur-write: 900ms; --dur-bracket: 560ms;
  --dur-hl: 380ms; --hl-stagger: 360ms; --dur-copy-hold: 1500ms;
}
```

### Tailwind v4 (`app/globals.css`)

These names are new. Do not reuse the site's current `--paper` or `--rust`, or shadcn's `--background`.

```css
@theme inline {
  --color-ground: var(--ground);  --color-surface: var(--surface);
  --color-ink: var(--ink);  --color-ink-muted: var(--ink-muted);  --color-ink-idle: var(--ink-idle);
  --color-ink-faint: var(--ink-faint);  --color-hairline: var(--hairline);  --color-rule: var(--rule);
  --color-pen: var(--pen);  --color-pen-wash: var(--pen-wash);
  --font-sans: var(--font-sans);  --font-pen: var(--font-pen);
  --text-micro: 11px; --text-small: 12px; --text-ui: 13px; --text-body: 14px; --text-body--line-height: 20px;
  --text-lead: 16px; --text-title: 20px; --text-title-lg: 24px; --text-pen: 16px; --text-pen-lg: 21px;
  --shadow-surface: var(--surface-shadow);
  --ease-pen: var(--ease-pen); --ease-write: var(--ease-write); --ease-press: var(--ease-press);
}
```

## 3. The pen

The pen is the voice of the site. It is restrained: fewer marks always win.

**One colour per page.** The ring, wash, arrow, notes, the copy button's done state, the read-next arrow and
any accent inside a product shot all use `--pen`. Everything else is neutral.

| Page | Pen | From |
|---|---|---|
| Home | `--pen-rose` | 64 |
| About | `--pen-rust` | 67 |
| Writing index | `--pen-rust` | 49 |
| Post | `--pen-blue` (41 is the canonical page; 45 used rust, 44 green) | 41 |
| Portfolio | `--pen-red` (51; 55 used blue) | 51 |
| Company page | `--pen-green` | 53 |

The colour stays the same at every breakpoint. Piece 42 used teal on the phone, and that does not carry over (§7).

**The marks.** The set is finite. Nothing outside this list.

| Mark | Use for | Never |
|---|---|---|
| **Bracket** (01) | one paragraph that carries a point, with its note beside it | on a phone (no margin), on lists |
| **Ring** (03/20/29/31) | one *fact*: a number, an outcome ("Acquired"), the current page | decoration, a word that isn't a fact, roaming free |
| **Ring + arrow** (03) | a ringed fact in prose whose note sits in the margin | when the note is level with the ring (use a tick) |
| **Highlighter** (05) | the one sentence or title that carries the page | more than one per page |
| **Write-in note** | the words beside a mark; "copied" by the copy button | without a mark beside it (except "copied") |
| *Strike-through* (34, secondary) | one editor's mark on a ledger outcome | prose, EN/NO, as a page's feature |

**Maximum per page.** A post gets one bracket, one highlighter and one ring with an arrow, each on its own paragraph. Optionally
the last mark (45): a note and a hand-drawn arrow back to read next, drawn once read next is in view. The writing index
and home get one wash plus one note. Portfolio and company pages get one ring plus one note. About gets none in the column. The ring around the
current page in the header is not a note. It says where you are, so it stays when the pen is hidden (59).

**Notes.** These are Christer's voice: lowercase, dry, a few words, and only facts the site already states, cut down from
`lib/posts.ts`, `lib/companies.ts` and `lib/content.ts`. Never invent a fact. Write them in both languages
(`round-3/i/marks.ts`, `round-3/k/_page.tsx` `PEN`). ✓ `that far north of oslo` ✗ `An amazing journey north!`
Notes are `aria-hidden`. When the note adds a fact, add an `sr-only` copy next to the marked element (51, 53).

**Hiding.** Posts carry `PenToggle` at the foot of the rail ("Hide the pen" / "Show the pen", "Skjul pennen" /
"Vis pennen") and in the phone menu. It is a `button[aria-pressed]` with a 7px dot, filled with `--pen` when on and drawn as a `--ink-faint` ring when off.
The pen is **on by default**: 43, where it started off, was not kept. Hiding is quick and all at once: strokes 260ms, highlighter 220ms,
fades 180ms, write-ins 220ms.

**Motion.** All of it lives in `round-2/e/pen.tsx`, `round-1/a/parts.tsx` and `round-2/h/chrome.tsx`.
- Trigger: the page has been seen (IntersectionObserver at 0.4), then "armed" 140ms after load or a page turn. Each mark
  waits until its paragraph comes into view (top within 86% of the scroller). Marks already on screen at load draw in reading
  order at `300ms + rank × 1200ms` (1300ms on a phone). A mark that scrolling brings in draws 250ms after it arrives. Once drawn, it stays.
- Ring: a stroke-dashoffset draw (`pathLength=1`, `stroke-dasharray: 1 1.1` so no cap dot is left), 640ms `--ease-pen`.
  Arrow: 420ms at +560ms. Head: 160ms at +960ms. Note: write-in at +1040ms.
- Bracket: clip-path reveal from the top down, 560ms `--ease-bracket`. Its note writes in at +520ms.
- Highlighter: background-size from 0% to 100%, set to 78% height at 62% y, 380ms `--ease-hl` per stroke. Strokes break after each comma
  and are staggered by 360ms. Its note comes in at +900ms. A one-stroke title wash (`j-hl`): 520ms with a 120ms delay, 80% height.
- The rest steps back (home ledger, 05): the other rows go to `--ink-stepped-back` over 480ms, starting 760ms after the wash.
- Write-in: `clip-path: inset(-30% 100% -30% -4%)` → `inset(-30% -4%)`, 900ms `--ease-write`, rotated −2deg
  (−1.5deg inline on a phone).
- Ledger notes (49, 64): opacity, rotate −6→−3deg and a translate of (−0.6cqw, 0.4cqw) to 0, 360ms `--ease-settle`, 900ms delay.
  Ledger margin notes (51, 53): a 320ms tick draw (`cubic-bezier(.55,.05,.3,1)`, 380ms delay), then the words slide 300ms from −0.8cqw
  (`--ease-card`, 520ms delay).
- Ring around a fact in a ledger (`g-ring`): draws in over 520ms `--ease-loop` after a 60–500ms delay, and undraws in 180ms `cubic-bezier(.4,0,1,1)`.
- **Reduced motion:** every stroke, sweep and clip finishes in 0ms with no delay. Fades become opacity only, at 160–200ms.
  Rings appear drawn. Nothing translates or scales. Smooth scroll becomes `auto`.

**Geometry.** Rings are measured from the real text (`useMarkRects`), so they scroll with the words.
- Prose ring (`ringPath`): rx = w/2 + 0.7em, ry = h/2 + 0.37em (1.5u and 0.8u, where u = 1cqw). It starts top-left, goes round
  once and overshoots the start. Stroke `max(1.2px, 0.26cqw)` ≈ 1.7px, with round caps and joins.
- Arrow (`arrowPath`, lift 0.8): runs from the ring's top-right to 1.2u left of the note, bowing up. The head is two strokes, 1.8u long at ±0.5rad.
- Loop ring (headers, ledgers, `LOOP_D` in a 100×40 box, `vector-effect: non-scaling-stroke`): padding is 0.5×h
  horizontal and 0.42×h vertical (0.45 and 0.36 in the phone menu). Stroke 1.5px (1.4px in ledgers). The ledger inset is `-0.55cqw -1cqw -0.5cqw -1.1cqw`
  (≈ −0.26em −0.47em −0.23em −0.51em).
- Bracket: the kit's `Bracket` path, 1.3px, 10px wide, 10px right of the column, note 8px beyond it.

## 4. Components

Shared rules: every interactive word gets an invisible hit area at least 44px tall (`.h2-hit::after`, width
`max(100%, --hw)`). Presses scale to 0.97 over 140ms `--ease-press`. Focus is `2px solid var(--ink)`, offset 3px, radius 0.3em.
Hover styles go only under `@media (hover:hover) and (pointer:fine)`. Transitions name their properties (never `all`).

### Header
The header row sits in the top fade (no background of its own, no edge line; the fade does the framing) and holds the name on the left (560, −0.006em, links home) and the
four pages plus EN / NO on the right, 13px with a 20px gap. Pages sit at `--ink-idle`, the current one is `--ink`, and **the pen's loop
rings it** (`TravelRing`). No bold, no underline. Changing page lifts the ring, slides it 420ms `--ease-loop` and draws it
again (560ms, 90ms delay).
- Variants: `current: "home" | "about" | "portfolio" | "writing" | "contact"`. Home rings nothing. On a company page
  Portfolio stays ringed with `aria-current="true"`. On a post, Writing stays ringed.
- Props: `{ current; lang; setLang; pen }`. Sticky.
- ✓ `Writing` in ink with a blue loop round it. ✗ `Writing` bold, underlined or in a pill.

### EN / NO
Two quiet letters: 11px, 560, +0.02em, with a `/` in `--slash` between them. The inactive one is `--ink-faint` and hovers to ink. The active one is ink
with `cursor: default`. Markup is `role="radiogroup"`, buttons are `role="radio"`, and arrow keys move between them (`langKeys`). Hit width 30px. It sits 8px after the nav.
Switching re-sets the page in place (300ms, fade plus 0.3em rise; a 200ms fade under reduced motion) and the pen draws again.
- ✓ `EN / NO` at the end of the header. ✗ a flag, a dropdown, or a struck-out language (39).

### Rail
benji's fixed left rail: `↩ Index` (or `↩ All writing` on posts) above the sections, 13px, leading 1.35, about 8px between
items, at `--ink-idle`. The section you are reading turns `--ink` (220ms ease-out) and gets `aria-current="location"`. Scroll-spy reads a line 34% down the viewport, and the last item activates at the bottom of the page. Clicking scrolls smoothly to the section, 12% below the top.
- Variants: `sections` (post, about, home) and `years` (writing index). It holds the PenToggle on posts.
  On a phone it becomes a one-line strip under the header row (42), in the same colours.
- Only on pages with a rail column (home, about, writing, post). Portfolio and company pages have none, and their column moves left.
- ✗ a pen arrow or ring tracking the rail (02's arrow and 47's ring were not carried forward), or a second ground behind it (14).

### Rule (section heading)
A grey label (`--ink-muted`, 460, body size) with a hairline running right, gap 10px, 40px above and 9px below. An optional
count sits at the right in `--ink-faint`. ✓ `2026 ———————`. ✗ an uppercase eyebrow, a bold h2.

### Ledger
Facts as a tabular ledger on the ground. Never a card or table chrome. `font-variant-numeric: tabular-nums`. Rows are 44px tall at minimum, with
7px vertical padding. The first row of a group gets a `--rule` top border, the rest `--hairline`. The year is printed **once per group**, in
`--ink-muted`. Hover sets the row background to `--row-hover` (140ms). A row is one link.
- `writing` (49, home): `[title →] [read · dd/mm]`. On the index each title gets a 12px excerpt and the column is `1fr auto`. On home it is
  `year 2.8em | title 1fr | read auto | dd/mm auto`, with a 1.2cqw gap. The newest title takes the wash and one note. The title arrow
  sits at `--ink-faint` and on hover turns `--pen` and moves 0.5cqw. The title's underline goes from transparent to `--ink-faint`.
- `portfolio` (51): header row in `--ink-faint` (`Year · Company · Role · Outcome`), columns `6cqw 15.5cqw 15.5cqw 1fr`
  (≈ 72/186/186px at 648). Names at 520 in `--ink-ledger-dim`, or `--ink` when ringed. The outcome is right-aligned:
  live companies in `--ink-faint`, ended ones as `"{stage}, {year}"` in `--ink-muted`. The ring and note rest on Docdir's outcome.
- `facts` (53): `dl` with four rows (Role, Stage, Year, Sector). The label is muted on the left, the value right-aligned. One ring on the company's fact
  (`PEN[slug].fact`), drawn at 560 weight.
- `now-before` (10, home): work rows of name (520) plus what it is (`--ink-faint`), with the period right-aligned in muted. A second Rule
  `Before` (22px above) holds the sunset companies. 33 is the phone form: rows stack, years stay tabular.
- ✗ zebra stripes, coloured status pills, or more than one ring.

### Link (+ preview card)
Links have no colour: ink text with a 1px underline, offset 0.24em, in `--underline`. Hover turns the underline ink (180ms). Footer address: offset
0.22em in `--ink-faint`. Back links (`↩ Portfolio`) hide the underline. External links end in `↗`.
- `preview` variant (07): a company named in prose is a `button` that opens a card under the paragraph, lined up with the word, on
  pointer-enter, focus or tap. Esc, blur or leaving closes it. The open link's underline turns `--pen`. Card: `--surface`, `--surface-shadow`
  (0.14 on the last layer), radius 8px, padding 9px 12px 10px, 12px text at leading 1.38. Contents: name (560) plus status (muted), then one line
  (muted), then role · years (faint, tabular). Moves 220ms `--ease-card`; opacity 160ms.
- `margin card` (55): the same card, but in the right margin level with a hovered ledger row, radius 9px, with a 6px `--pen` status dot.
- ✓ `Docdir` underlined in grey, opening a card. ✗ blue links, or links that are bold or carry an icon.

### ReadNext
Placed after the last paragraph: 40px of space, a hairline, 14px of padding. A grey label (`Read next`, 0.82em, faint), then **one** title
(16px, 560, −0.012em, balanced) and one `→`, then `date · read` in faint, tabular. Only the arrow moves: it rests at `--ink-muted` and on hover or focus
turns `--pen` and moves 0.22em (220ms `--ease-arrow`). The title's underline goes from transparent to faint. On a post, following it turns
the page in place. With 45's last mark, the arrow takes the pen colour 600ms after the hand-on arrow lands. Company pages use it with
the next company plus its tagline. ✗ a "related posts" grid, or thumbnails.

### Footer (copy address)
The footer is only the address. It has a hairline top, sits about 64px below the content, has about 36px of padding above and 48px below, and is aligned to the column.
The `mailto` address is 16px at weight 520 and −0.012em. The copy button is 12px, 2.2em tall, padded 0 0.7em 0 0.6em, radius 0.6em, with an inset 1px `--hairline` ring,
in `--ink-muted`. Hover turns it ink on `--control-hover`. On click (17): it writes to the clipboard and the glyph swaps to a check that draws itself
(260ms, 60ms delay). The label crossfades `Copy` → `Copied`, and the button turns `--pen` with a `--pen-ring-30` ring and a `--pen-tint` fill. The pen
writes `copied` / `kopiert` beside it (21px, −4deg, a 520ms clip with a 120ms delay). It holds for 1.5s. If the clipboard refuses, the address is
selected and `Selected. Press ⌘C to copy.` shows for 2.6s in an `aria-live="polite"` line. Under the address: `contactContent.availability` in faint.
- Variants: `default`, `stacked` (phone), and `signature` (about, see Portrait).
- ✗ link columns, socials, copyright, or EN/NO in the footer.

### Stage (grid wall)
benji's demo wall, **only behind a product shot**. Never behind the page. `--ground` with 1px `--wall-line` lines in a 48px cell
(4cqw; 11 cells across the column), positioned at `-1px -1px`.
- Variants: `inline` (44): inside the column, about 28cqw tall, framed by an inset 1px hairline, with a caption below in 12px muted.
  `full-bleed` (53): page-wide, about 32cqw tall, with hairlines only at top and bottom, and the caption aligned to the column in faint.
- The shot is a `--surface` sheet, radius 5px, with `--surface-shadow`. Any accent inside it (the prospectus checks) is `--pen`. It arrives slightly
  off the grid and settles onto the lines once, the first time it is seen: 44 uses translate 520ms `--ease-settle`, 53 uses translate 300ms plus
  opacity 260ms after a 650ms beat. Reduced motion: it is already in place, with opacity only.
- One Stage per page at most. ✗ the wall as the page's ground (13), a wall behind text, a second accent.

### Portrait
- `toned` (home, 64): in the right margin beside the name, 4.6cqw (≈55px) off the column, 15cqw wide (≈180px), 4:5,
  cropped to the face area (cx 0.58, cy 0.43, span 0.56). It is greyed and lifted with `filter: grayscale(1) contrast(0.52) brightness(1.38)` and faded
  with `mask-image: linear-gradient(to bottom, #000 58%, transparent 97%)`. No border, no radius.
- `signature` (about, 67): it replaces the footer as a sign-off. A 48px square (7.6cqw), radius 5px, `0 0 0 1px var(--hairline)`,
  cropped to the face (`scale(2.1)`, origin 59% 38%), with 14px to the name (560, −0.01em) and the availability line in muted.
  The address and copy sit 17px below. The pen does not sign: it only writes `copied`.
- ✗ a photo at the top of a page or as a hero (46, 48, 68), a framed print on the wall (66), a byline circle (62).

### Phone menu (40/42)
The header row holds the name and a 44px burger: two 1.5px lines at ±0.6cqw that rotate ±45° (220ms `--ease-arrow`). The menu is a
panel on `--ground` from under the header row to the bottom. It opens with opacity plus a −1.2cqw rise over 200ms ease-out and closes over 150ms (visibility is delayed).
It holds the four pages (≈19px, at least 44px tall, hairlines between, idle grey, the current page in ink with the pen's loop), then a hairline, then EN / NO
on the left and the PenToggle on the right. Tapping a page closes the menu 120ms later (0ms under reduced motion). Esc closes it and returns focus to the button. The page behind
is `inert` while it is open. `aria-expanded` and `aria-controls`.

### PenToggle
See §3. 13px, ink, hovering to `--pen`. 21px above it in the rail.

## 5. Pages

Every page: Header → content in the column → Footer, on `--ground` under the `--top-fade`.

- **Post** (41 desktop, 42 phone, 44, 45; `round-3/i/post.tsx`, `desktop.tsx`, `marks.ts`): Header (Writing ringed),
  Rail (`↩ All writing`, the post's three sections, PenToggle). Column from 28%: date · read (micro, tabular, muted), h1
  (20px), three paragraphs that are also the rail's sections, each carrying one mark, with notes in the right margin. An optional inline Stage
  after the paragraph about the product (44). ReadNext, with an optional last mark (45). Footer. Phone: the rail becomes a strip, notes are
  written inline under their paragraph (right-aligned, at most 88% wide), there is no bracket and no arrow, and the menu holds EN/NO and the PenToggle.
- **Writing index** (49; `round-3/j/site.tsx`): Header (Writing ringed), a Rail of years. Kicker (muted), h1 intro (20px).
  For each year a Rule plus the `writing` Ledger with excerpts, the newest washed with the note `← the one about the sale`. A totals line
  (`3 posts · 9 min`, rule top, faint, tabular).
- **Portfolio** (51 + 55; `round-3/k/_page.tsx`): Header (Portfolio ringed), no rail, wide column from 16%. Kicker
  (12px muted), h1 intro (20–21px). The `portfolio` Ledger with its ring resting on Docdir's outcome and its note in the margin. Footer. For how 51 and 55 combine, see §7.
- **Company** (53; `round-3/k/_company.tsx`): Header (Portfolio ringed, `aria-current="true"`). `↩ Portfolio`, name
  (24px), tagline (muted), the `facts` Ledger with one ring and note, then a full-bleed Stage with the product (only when one exists), the body
  paragraphs, `Visit ↗`, Rule `Writing` plus the related post as a link row, ReadNext (the next company), Footer.
- **Home** (64; `round-4/m/_home.tsx`): Header (nothing ringed). Rail: About · Writing · Work. The name at **body size**
  (560) with the role in muted under it: no larger heading. The toned Portrait in the right margin. One paragraph with preview links. Rule
  Writing plus the `writing` Ledger (the newest washed, the rest stepping back, its note), `All writing →` (small, muted link). Rule Work plus the
  now-before Ledger. Footer.
- **About** (67; `round-4/n/_about.tsx`): Header (About ringed). Rail: `↩ Index`, then the kicker · Background · Press. Kicker plus
  h1 (20px), four bio paragraphs with preview links on each company's first mention, Background (Rule plus a timeline ledger: year 5cqw
  muted, event in ink), Press (Rule plus headline links, outlet in faint), then the signature Portrait as the footer. No photo in the column.

## 6. Does not belong

- **Free-roaming rings as decoration** (20: a ring that follows the pointer): a ring marks a fact or where you are, nothing else.
- **Strike-throughs as a feature** (34, 39): dropped in round 3. 34's single ledger mark survives only as secondary vocabulary.
- **Sidenote footnotes** (04): numbered notes turn the pen into apparatus. It is a voice.
- **Grain** (15): no texture on the ground. benji has none.
- **Two grounds** (14): one ground plus the top fade, nothing else.
- **Today's warm paper, Newsreader, JetBrains Mono, rust paper** (12): benji's ground won. The site's current `--paper`/`--rust` tokens do not carry over.
- **The grid wall as the page** (13): it comes back only as a Stage.
- **The ruler** (09), **the table of contents as the star** (02 as hero, 14), **the bare link with a status line** (16).
- **EN/NO as a feature** (18 hand-off, 24, 30, 39): it stays two quiet letters.
- **The pen signing the page** (25): the about sign-off is a photo plus the address, not handwriting.
- **The numbers column** (35) and **the bare band as the whole header** (37): dropped in round 3. Allowed only as secondary details.
- **The pen off by default** (43), **"only the numbers"** with the whole post greyed (22).
- **A photo hero on home** (46, 47), **the photo at the top of about** (48, 68), **the photo as a wall print** (66), **a byline** (62),
  **the name opening a photo card** (63), **no face at all** (61), **the photo moved down beside Background** (65).
- **Not carried forward, no reason recorded:** 50 (one-page site), 52 (portfolio rows unfolding on a phone), 54 (company names as
  links that turn the page), 56 to 60 (the rail as a post list, no rail on a phone, contact as the grown footer, the pen as a sitewide header
  setting, the 404).
- Anywhere: gradients, glass, shadows on text, coloured links, a second accent, icons beside nav items, pills or badges.

## 7. Open questions and inconsistencies

1. **The pen font is a stand-in.** Caveat (`lab/fonts.ts`) holds the place of a font made from Christer's own handwriting, the way
   benji's notes use his. When that font exists, re-tune `--text-pen` and `--text-pen-lg`: Caveat's small x-height is why
   ledger notes run at 21px.
2. **Resolved: the top band is benji's fixed 128px eased fade, not a solid band** (re-measured 2026-11-15). The lab drew a
   solid white band with a 0.06 edge line; the real site uses `--top-fade` and no edge. `--band-h` remains only as the
   48px header row height.
3. **Resolved: no band edge line.** benji has none.
4. **Pieces that deviate from the benji ground:** 42 draws its phone on the lab tile `#F2F2F1` (lab chrome only; the page
   inside is `--ground`). Stages (44, 53) put a texture on the ground; that is allowed only inside a Stage. 67's portrait box has a placeholder
   fill of `#2A2522`. Cards and the prospectus sheet are `#FFFFFF` surfaces. Nothing else deviates.
5. **Pen colour per page** is my reading. The lab never set a site-wide map: posts used blue (41), teal (42), green (44) and rust (45), and the
   portfolio used red (51) and blue (55). Home rose, portfolio red, and about/writing rust are three close warm reds. Christer could
   instead set one colour per header section. 42's teal on a phone is a lab artefact: one page keeps one colour.
6. **Portfolio, 51 vs 55.** Both are kept, and they conflict on hover: 51 moves the ring and note to any row, while 55 keeps the ring on Docdir
   and opens a margin card. 51 uses the year ledger; 55 uses the site's groups (Building, Angel, Exits, Sunset). **Chosen:** 51's year ledger with the ring
   and note at rest on Docdir. Pointing at a row opens 55's margin card in place of the note, and the ring stays on Docdir.
7. **Column width.** Pages with a rail use 28% / 44cqw (528px). Portfolio and company pages use 16% / 54cqw (648px). That is consistent
   by rule (rail or no rail), but they are two widths.
8. **Wash strength.** Post pieces use 15–17% (41: 17, 44: 16, 42/45: 15). Index and home use 22% (`site.tsx`). I chose 16% for both.
9. **Rail position** varies a little: i places it at 4.2cqw, 14.4cqw top, 20cqw wide; j at 4.6cqw, 14.8cqw, 18cqw.
   Note size: 2.5cqw beside prose, 3.1–3.3cqw elsewhere, so there are two tokens.
10. **The stage settle** differs: 520ms translate (44) against a 650ms beat then 300ms translate (53). Use 520ms `--ease-settle` everywhere.
11. **The pen toggle** exists only on posts in the lab. If notes on home or the portfolio need hiding, 59 (a sitewide toggle) was not kept.
12. **Portrait colour:** home (64) tones the photo to grey; the about signature (67) is in full colour at 48px. Both are kept as they are.
