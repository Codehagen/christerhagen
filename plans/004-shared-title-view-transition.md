# 004 — Morph the clicked title across list → detail navigations (shared-element view transition)

- **Status**: TODO
- **Commit**: `07cfdd0`
- **Severity**: LOW (polish — additive spatial continuity, nothing is broken today)
- **Category**: Missed opportunities / Physicality & origin
- **Estimated scope**: 5 files, ~20 lines total (4 components + `app/globals.css`)

## Problem

The site's two genuine parent→child journeys — writing index → post, and
portfolio index → company detail — navigate with a full-root 250ms crossfade
(next-view-transitions drives the native View Transitions API; the root timing
lives in `app/globals.css:203`). The title the user just clicked vanishes and
re-renders at a new position/size on the next page with no continuity. A
shared-element transition would carry that one element across, telling the
spatial story "the thing you clicked became this page."

**Design-license note (read before editing):** this site is a 1:1 Claude Design
import, and `app/globals.css:198` deliberately licenses "a plain crossfade only
— no slides, this flat site has no nav hierarchy to imply." That comment rejects
directional *slides* between the flat top-level pages. List→detail is the one
real parent/child hierarchy the site has, so this plan deliberately extends the
license for exactly that seam — titles only, nothing else. Step 1 updates the
comment so the license stays accurate; do not add motion to any other element.

Current code:

```tsx
{/* components/writing-content.tsx:34 — list item title (inside a per-slug .map over postOrder) */}
<h2 className="mb-[9px] text-[25px] leading-[1.2] font-medium">
  {p.title}
</h2>
```

```tsx
{/* components/post-content.tsx:27 — post detail title */}
<h1 className="m-0 mb-9 text-[clamp(28px,8.5vw,38px)] leading-[1.18] font-semibold tracking-[-0.015em] text-(--ink-strong)">
  {post.title}
</h1>
```

```tsx
{/* components/portfolio-content.tsx:31 — repeated for built/invest/exits/sunset rows, all per-slug .maps */}
<span className="text-[21px] leading-[1.15] font-medium">
  {b.name}
</span>
```

```tsx
{/* components/company-content.tsx:30 — company detail title */}
<h1 className="m-0 text-[clamp(30px,9vw,40px)] leading-[1.12] font-semibold tracking-[-0.015em] text-(--ink-strong)">
  {company.name}
</h1>
```

```css
/* app/globals.css:203 — current: only the root snapshot pair gets the brand timing */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 250ms;
  animation-timing-function: var(--ease-out-quart);
}
```

## Target

Matching per-slug `view-transition-name`s on the list title and the detail
title. When both the outgoing and incoming page contain an element with the
same name, the browser automatically lifts it into its own transition group and
morphs its position/size while crossfading the two snapshots — the root
crossfade continues underneath, unchanged. Works in both directions (back
navigation reverses the morph) with zero JS.

Naming scheme (slugs are kebab-case in `lib/posts.ts` / `lib/content.ts`, so
they are valid CSS custom-idents as-is):

- Writing: `post-title-<slug>` (e.g. `post-title-docdir-visma`)
- Portfolio: `company-title-<slug>` (e.g. `company-title-bedrifty`)

Set via React's style prop — React 19 supports the camelCase property directly:

```tsx
/* target — writing-content.tsx list title */
<h2
  className="mb-[9px] text-[25px] leading-[1.2] font-medium"
  style={{ viewTransitionName: `post-title-${slug}` }}
>
  {p.title}
</h2>
```

The named group must run on the brand curve, not the UA default. Extend the
existing rule from `(root)` to `(*)` and give the geometry-morph group the same
timing (`::view-transition-group` animates the box's transform/size;
`old`/`new` animate the crossfade):

```css
/* target — app/globals.css, replacing the ::view-transition-old(root)/new(root) block */
::view-transition-old(*),
::view-transition-new(*),
::view-transition-group(*) {
  animation-duration: 250ms;
  animation-timing-function: var(--ease-out-quart);
}
```

No new durations, curves, keyframes, or dependencies. The existing
reduced-motion guard at `app/globals.css:209` already targets
`::view-transition-old(*) / new(*) / group(*)` with `animation: none
!important`, so it covers the new named groups with no changes.

## Repo conventions to follow

- The single motion curve is `--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1)`,
  defined in `app/globals.css:55`. Do not introduce another curve or duration.
- View-transition styling lives at the bottom of `app/globals.css`
  (lines 198–215) with a prose comment explaining the license — imitate that
  comment style when updating it.
- Motion decisions are documented in place: see the `.enter` block comment at
  `app/globals.css:171` for the tone of a "license" comment.
- Both locales render through the same components (`/no` routes pass
  `lang="no"` into the identical component), so tagging the four components
  covers all eight routes automatically.

## Steps

1. **`app/globals.css`** — replace the selector list of the existing timing
   block (lines 203–207) with `::view-transition-old(*), ::view-transition-new(*),
   ::view-transition-group(*)` (same body: `animation-duration: 250ms;
   animation-timing-function: var(--ease-out-quart);`). Update the comment above
   it (lines 198–202) to record the extended license, e.g. append: "One
   exception: list→detail titles (writing → post, portfolio → company) carry
   per-slug view-transition-names so the clicked title morphs into the detail
   heading — the site's one real parent/child seam. The `(*)` selectors keep
   those named groups on the same 250ms brand curve."
2. **`components/writing-content.tsx:34`** — add
   `style={{ viewTransitionName: `post-title-${slug}` }}` to the list `<h2>`
   (the enclosing `.map` already provides `slug`).
3. **`components/post-content.tsx:27`** — add
   `style={{ viewTransitionName: `post-title-${slug}` }}` to the `<h1>` (the
   component receives `slug` as a prop).
4. **`components/portfolio-content.tsx`** — add
   `style={{ viewTransitionName: `company-title-${b.slug}` }}` to the name
   `<span>` at line 31, and the same (with `i.slug` / `x.slug` / `s.slug`) to
   the identical name spans in the invest (line 51), exits (line 71), and
   sunset (line 89) sections.
5. **`components/company-content.tsx:30`** — add
   `style={{ viewTransitionName: `company-title-${slug}` }}` to the `<h1>`.
   Check how the component receives its data: if only a `company` object is in
   scope, use its slug field or thread the `slug` prop the page already has —
   the name must equal the one the portfolio list generates for that slug.

## Boundaries

- Do NOT tag any element other than the six title nodes listed above. Not the
  home-page writing rows (`components/home-content.tsx` — plain crossfade stays
  correct there), not the "read next" link in `post-content.tsx:47`, not dates,
  excerpts, badges, or back-links.
- Do NOT add slides, scale, or custom `::view-transition` keyframes — the morph
  geometry comes from the browser; only duration/curve are ours.
- Do NOT change any markup structure, class names, font sizes, or copy.
- Do NOT add dependencies (`next-view-transitions` is already installed and is
  what triggers `document.startViewTransition`).
- If line numbers or code excerpts don't match (drift since commit `07cfdd0`),
  STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm typecheck` and `pnpm lint` pass; `pnpm build` succeeds.
  Grep check: exactly one `viewTransitionName` per title node —
  `grep -rn "viewTransitionName" components/` should list writing-content (1),
  post-content (1), portfolio-content (4), company-content (1).
- **Feel check** (Chrome; `pnpm dev`):
  - `/writing` → click a post: the clicked title glides and grows into the post
    `<h1>` while the rest of the page crossfades. Browser back: the morph runs
    in reverse.
  - `/portfolio` → click a company (one from each section): same behavior.
  - Titles you did *not* click must not fly in from odd positions — only the
    matching pair morphs; everything else crossfades.
  - DevTools → Animations panel at 10% speed: the title's motion follows one
    smooth decelerating curve (ease-out-quart), no linear segment, and total
    duration stays 250ms — the navigation must not feel slower than before.
  - Norwegian mirror: `/no/writing` → post behaves identically.
  - Rendering panel → emulate `prefers-reduced-motion: reduce`: navigation is an
    instant cut (no morph, no crossfade), matching today's reduced-motion
    behavior.
  - Safari/Firefox sanity: navigation still works as a plain jump/crossfade
    where View Transitions are absent or partial — no errors, no flash of
    unstyled content.
- **Done when**: all mechanical checks pass and the feel checks confirm the
  title morph on both journeys, both locales, both directions, with
  reduced-motion and non-supporting browsers unregressed.
