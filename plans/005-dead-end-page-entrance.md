# 005 — Extend the licensed first-load entrance to the 404 and error screens

- **Status**: DONE (2026-07-16 — implemented directly in the working tree; typecheck, lint, tests, and build all pass; entrance classes verified in served 404 HTML for both locales)
- **Commit**: `07cfdd0`
- **Severity**: LOW (polish — additive "delight budget" motion, nothing is broken)
- **Category**: Missed opportunities
- **Estimated scope**: 5 files (4 page components + 1 comment update in `app/globals.css`), ~10 lines of className changes total

## Problem

The site's motion system licenses exactly one first-load entrance: `enter-rise`,
a 0.5s fade + 8px rise applied to the home hero via the `.enter` / `.enter-delay`
utility classes defined in `app/globals.css:167-184`:

```css
/* app/globals.css:167-184 — current (do not change, shown for reference) */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
    }
  /* The one licensed first-load entrance — a single fade + 8px rise on the
     home hero. Defined under no-preference so reduced-motion users get the
     final state with no flash. One container per call; never staggered lists. */
  @keyframes enter-rise {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
    }
  .enter {
    animation: enter-rise 0.5s var(--ease-out-quart) both;
    }
  .enter-delay {
    animation-delay: 0.08s;
    }
}
```

The four dead-end screens — the EN/NO 404 pages and the EN/NO error boundaries —
render completely flat. These are rare, high-emotion moments (a visitor just hit
a broken link or a crash); per the site's own restraint rules, rare/first-time
surfaces are exactly where the delight budget lives. A gentle entrance softens
the dead end and makes the recovery screen feel intentional rather than like a
default failure page. Frequency is rare, so the motion cost is near zero.

Current code (the elements that will receive classes):

```tsx
// app/not-found.tsx:22-35 — current
        <div className={eyebrow}>404</div>
        <h1 className="mt-6 max-w-[18ch] text-[clamp(26px,7vw,33px)] leading-[1.3] font-normal tracking-[-0.015em] text-(--ink-strong)">
          This page doesn’t exist.
        </h1>
        <p className="mt-5 max-w-[42ch] text-[17px] leading-[1.62] font-normal text-(--ink-muted)">
          The link may be broken, or the page may have moved. Let’s get you back
          to something that does exist.
        </p>
        <Link
          href="/"
          className={`${buttonVariants({ variant: "pill", size: "pill" })} mt-8`}
        >
          Back home
        </Link>
```

`app/no/not-found.tsx:24-37` is the Norwegian mirror of the same structure.

```tsx
// app/error.tsx:34-56 — current
        <div className={eyebrow}>Error</div>
        <h1 className="mt-6 max-w-[18ch] text-[clamp(26px,7vw,33px)] leading-[1.3] font-normal tracking-[-0.015em] text-(--ink-strong)">
          Something went wrong.
        </h1>
        <p className="mt-5 max-w-[42ch] text-[17px] leading-[1.62] font-normal text-(--ink-muted)">
          This page ran into an unexpected problem. Trying again usually clears
          it — if it keeps happening, head back home.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          …buttons…
        </div>
```

`app/no/error.tsx:33-55` is the Norwegian mirror of the same structure.

**Deliberately excluded:** `app/global-error.tsx`. Its own comment says "Kept
intentionally minimal and self-contained" — it renders only when the root layout
itself has crashed, and a catastrophic-failure screen should not depend on any
extra styling behavior. Do not touch it.

## Target

Each of the four pages animates in with the exact same two-beat rhythm the home
hero uses (`components/home-content.tsx:24-32`): the headline group enters
immediately, the supporting text and CTA enter 0.08s later. No new CSS, no new
tokens, no new keyframes — only the existing `.enter` and `.enter-delay` classes
added to existing elements.

Timing group A (`enter`): the eyebrow (`404` / `Error` / `Feil`) and the `<h1>`.
Timing group B (`enter enter-delay`): the body paragraph and the CTA (the `Link`
on 404 pages; the button-row `<div>` on error pages — apply the classes to the
wrapper div, not to each button).

Resulting motion: `enter-rise` — `opacity: 0; translateY(8px)` → settled, 0.5s,
`var(--ease-out-quart)` (`cubic-bezier(0.165, 0.84, 0.44, 1)`), fill `both`,
second group delayed 0.08s. Reduced-motion users get the final state instantly
(the keyframes are defined inside `@media (prefers-reduced-motion: no-preference)`,
and the global reduce block at `app/globals.css:186-196` zeroes durations) —
this already works, nothing to add.

## Repo conventions to follow

- The exemplar to imitate is the home hero, `components/home-content.tsx:24-32`:
  `className="enter …"` on the h1, `className="enter enter-delay …"` on the two
  paragraphs. Classes are prepended in the same string; no wrapper elements added.
- The eyebrow uses a shared class string from `lib/typography.ts` interpolated as
  `className={eyebrow}` — extend it inline as ``className={`${eyebrow} enter`}``
  (the same backtick pattern the 404 CTA already uses for `buttonVariants`).
  Do NOT edit `lib/typography.ts`; the eyebrow class is used on every page.
- Motion vocabulary lives in `app/globals.css`; this plan adds no vocabulary,
  only updates one comment (Step 5) so the documented license stays truthful.
- EN and NO files are deliberate mirrors — any change to one must be applied
  identically to its sibling.

## Steps

1. **`app/not-found.tsx`** — add classes to four elements inside `<main>`:
   - `<div className={eyebrow}>` → ``<div className={`${eyebrow} enter`}>``
   - `<h1 className="mt-6 …">` → `<h1 className="enter mt-6 …">`
   - `<p className="mt-5 …">` → `<p className="enter enter-delay mt-5 …">`
   - The CTA `<Link … className={`${buttonVariants({ variant: "pill", size: "pill" })} mt-8`}>` →
     append ` enter enter-delay` inside the template string:
     ``className={`${buttonVariants({ variant: "pill", size: "pill" })} enter enter-delay mt-8`}``

2. **`app/no/not-found.tsx`** — apply the identical four changes to the mirrored
   elements (`404` eyebrow, `Denne siden finnes ikke.` h1, body `<p>`,
   `Tilbake til forsiden` Link).

3. **`app/error.tsx`** — add classes to four elements inside `<main>`:
   - `<div className={eyebrow}>Error</div>` → ``<div className={`${eyebrow} enter`}>Error</div>``
   - `<h1 className="mt-6 …">` → `<h1 className="enter mt-6 …">`
   - `<p className="mt-5 …">` → `<p className="enter enter-delay mt-5 …">`
   - The button row `<div className="mt-8 flex flex-wrap items-center gap-3">` →
     `<div className="enter enter-delay mt-8 flex flex-wrap items-center gap-3">`
     (classes go on this wrapper div only — not on the button or Link inside it).

4. **`app/no/error.tsx`** — apply the identical four changes to the mirrored
   elements (`Feil` eyebrow, `Noe gikk galt.` h1, body `<p>`, button-row div).

5. **`app/globals.css`** — update the license comment at lines 171-173 so it
   documents the new scope. Replace:

   ```css
   /* The one licensed first-load entrance — a single fade + 8px rise on the
      home hero. Defined under no-preference so reduced-motion users get the
      final state with no flash. One container per call; never staggered lists. */
   ```

   with:

   ```css
   /* The one licensed first-load entrance — a single fade + 8px rise on the
      home hero and the dead-end screens (404 / error boundaries). Defined under
      no-preference so reduced-motion users get the final state with no flash.
      Two timing groups max per page; never staggered lists. */
   ```

## Boundaries

- Do NOT touch `app/global-error.tsx` (deliberately minimal — see Problem).
- Do NOT touch `lib/typography.ts`, `components/home-content.tsx`, or any other
  page/component.
- Do NOT add CSS beyond the Step 5 comment edit — no new keyframes, durations,
  easings, or delay tiers.
- Do NOT add wrapper elements or change markup structure; className edits only.
- Do NOT stagger more than the two existing timing groups (no per-element delays).
- If any cited line doesn't match the code you find (drift since commit
  `07cfdd0`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm typecheck && pnpm lint && pnpm build` — all pass with no
  new warnings. `grep -c "enter" app/not-found.tsx app/no/not-found.tsx app/error.tsx app/no/error.tsx`
  → each file contains the classes (4, 4, 4, 4 elements respectively).
- **Feel check**: `pnpm dev`, then:
  - Visit `/this-page-does-not-exist` and `/no/finnes-ikke`: eyebrow + headline
    rise in together; paragraph + CTA follow a beat later. It should read as one
    calm gesture, not a sequence — if the 0.08s gap reads as "steps", something
    is wrong (compare against the home page hero, which is the reference feel).
  - The error boundaries can be triggered by temporarily throwing inside a page
    component (e.g. add `throw new Error("test")` at the top of
    `PortfolioContent` and visit `/portfolio`; revert afterwards). Confirm the
    same two-beat entrance, and that clicking "Try again" re-runs the entrance
    without any flash of unstyled/final-state content.
  - In DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload
    the 404: content appears instantly at full opacity, no rise, no flash.
  - Header and footer must NOT animate — only the four `<main>` elements move.
- **Done when**: all four dead-end pages play the home-hero entrance (and only
  it), reduced-motion shows the final state instantly, and the globals.css
  comment matches the new license scope.
