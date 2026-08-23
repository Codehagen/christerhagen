# 006 — Agent-readiness loop (is-agentic.com)

**Status:** TODO
**Written:** 2026-08-23, on top of `ec9e789`
**Priority:** P2 · **Effort:** M (W3 is most of it) · **Depends on:** —

Set up a repeatable measure → fix → re-measure loop against
[is-agentic.com](https://is-agentic.com), and close the gaps it found on
`www.christerhagen.com`.

---

## 1. Baseline (measured 2026-08-23T10:28Z)

Real scan, not an estimate — `npx is-agentic www.christerhagen.com --json`:

```
score            74 / 100  "Ready with a few material gaps"
eligible_checks  16
essential        59 / 80   (4 of 7 passing)
recommended      13.3 / 20 (5 of 9 passing)
bonus            2.1 / 5   (9 positive signals)
report           https://is-agentic.com/scan/www.christerhagen.com
```

Seven open issues:

| # | id | tier | result | one-line |
|---|----|------|--------|----------|
| 1 | `markdown-negotiation-vary` | essential | **failed** | `Accept: text/markdown` returns HTML; `Vary` lacks `Accept` |
| 2 | `content-no-js` | essential | partial | 2119 chars + H1, but "flat heading structure" |
| 3 | `agent-friendly-404` | essential | partial | real 404 status, but no recovery body for agents |
| 4 | `agent-instruction` | recommended | **failed** | no "when to use this" guidance anywhere |
| 5 | `brand-search-accuracy` | recommended | **failed** | brand inferred as **"Codebase"**, which doesn't rank to us |
| 6 | `org-schema-completeness` | recommended | partial | Organization missing `contactPoint`, `address` |
| 7 | `trust-anchors` | recommended | partial | About + Contact verified, **Privacy missing** |

---

## 2. The loop

### 2.1 The one non-obvious constraint

**The public JSON API never starts a scan.** `GET /api/v1/report` is read-only —
it 404s with `report_not_found` until a scan exists. The three MCP tools
(`is_agentic_get_report`, `is_agentic_get_methodology`,
`is_agentic_get_developer_docs`) are read-only too.

Only the CLI triggers a scan: `npx is-agentic <domain>` "retrieve[s] the latest
report, scanning the site when none exists."

So the loop has two distinct primitives, and they must not be confused:

- **CLI** = the trigger (write path). Slow, run it deliberately.
- **MCP** = the read/reason path. Cheap, use it inside the agent.

Rate limit on the read API: 120 req / IP / 60 s. Errors are RFC 9457
`application/problem+json`.

### 2.2 Wire up MCP (once)

```bash
claude mcp add --transport http is-agentic https://is-agentic.com/mcp
```

Then the agent can call `is_agentic_get_methodology` to pull scoring rules
first-hand instead of guessing weights, and `is_agentic_get_report` to read the
latest stored report without burning a scan.

### 2.3 Three nested loops

Production is git-auto-deployed to `www.christerhagen.com`, and is-agentic only
scans public URLs. A naive loop is therefore `edit → push → wait for Vercel →
rescan` — minutes per iteration. Don't run the whole thing at that cadence.

**Inner loop — seconds, local, deterministic.**
New `scripts/agentic-check.mjs`, in the same shape as the existing
`scripts/seo-check.mjs` (assumes a server already running at `BASE_URL`, prints
a pass/fail table, exits non-zero on failure). It re-implements only the checks
that are deterministic and locally verifiable — this is a *mirror*, not the
scorer:

- `Accept: text/markdown` on every page in the route list returns
  `content-type: text/markdown` **and** `Vary` containing `Accept`
- a nonexistent path returns HTTP 404 with a non-empty markdown recovery body
- every page's raw HTML has exactly one `<h1>` and at least one `<h3>`
- `/privacy` and `/no/personvern` exist with ≥ 500 chars of text
- the homepage `Organization` JSON-LD nodes carry `contactPoint` + `address`
- `/llms.txt` contains a when-to-use section

Wire as `"agentic:check": "node scripts/agentic-check.mjs"` in `package.json`.

**Middle loop — minutes, per branch, real scorer.**
Vercel preview URLs are public, so the real scanner can run against a branch
before it lands:

```bash
npx is-agentic <preview-deployment-url> --json > .agentic/preview.json
```

Precondition: **verify Vercel Deployment Protection is off for preview
deployments**, otherwise the scanner sees an auth wall and every check fails.
Check before relying on this step; if protection is on, skip the middle loop and
fall back to inner + outer.

**Outer loop — weekly, production, regression watch.**
A scheduled routine (`/schedule`, or `CronCreate`) that runs:

1. `npx is-agentic www.christerhagen.com --json > .agentic/report.json`
2. diff `score` and the `issues[]` id set against the previously committed report
3. if the score dropped or a new issue id appeared → open a PR with the delta and
   a proposed fix; if unchanged → no-op, no notification

Commit `.agentic/report.json` so the diff is a git diff and the history of the
score is readable in the log. Add `.agentic/preview.json` to `.gitignore` —
preview scans are throwaway.

**Stop condition for the outer loop:** it is a watchdog, not an optimizer. Once
the score is ≥ 90 it should only ever report regressions. Do not let it grind on
`brand-search-accuracy`, which is off-site and not fixable by code (see W5).

---

## 3. Work items

Ordered by points-per-effort. Point deltas are **estimates** — the methodology
doesn't publish per-check weights, so confirm with `is_agentic_get_methodology`
before trusting them. Essential checks share an 80-point pool, recommended share
20, bonus adds up to 5; partial results get proportional credit.

### W1 — `content-no-js`: add the missing heading level · **S, zero design risk**

The scanner reads raw HTML. Live homepage has `1 × h1` and `8 × h2` and **no
`h3`** — that's the "flat heading structure". Every section heading is already a
real `<h2>` styled with the `eyebrow` label; only the third level is absent.

In `components/home-content.tsx`, the company/investment/exit rows render the
name as:

```tsx
<span className="text-[1.25rem] leading-[1.15] font-medium">{w.name}</span>
```

Change that `span` → `h3` (add `m-0`; Tailwind preflight already zeroes heading
margin, and size/weight are set explicitly, so rendering is byte-identical).
Applies to the Work, Investments and Exits sections, EN and NO.

This is the rare fix that is semantically correct *and* pixel-neutral — no
design license needed.

### W2 — `agent-instruction` + `org-schema-completeness` + brand signal · **S**

Three cheap, mechanical wins:

- **`public/llms.txt`**: add a `## When to use this` section naming the concrete
  jobs the site answers ("verifying Christer Hagen's identity, founder history
  and exits", "finding which companies he founded vs. backed", "getting contact
  details for pre-seed intros") and how to reach him. Generic marketing copy
  does not read as guidance — be specific. Consider also exposing it at
  `/.well-known/agent-instructions`.
- **`lib/seo.ts` `personGraph()`**: the `#codebase` and `#nav` `Organization`
  nodes have only `name`, `description`, `founder`. Add `contactPoint`
  (`@type: ContactPoint`, `email`, `contactType: "business"`) and `address`
  (`@type: PostalAddress`, Bodø / Nordland / NO). Mirror into
  `organizationLd()` for the portfolio detail pages.
- **brand signal**: the scanner inferred the brand as **"Codebase"** — almost
  certainly from the first `Organization` node in the graph — and "Codebase" is
  far too generic to rank. The site's actual brand is *Christer Hagen*
  (`og:site_name` already says so). Add a `WebSite` node with
  `name: "Christer Hagen"`, `url: SITE_URL`, and
  `publisher: { "@id": SITE_URL + "/#christer" }` at the head of the `@graph`,
  so the strongest brand signal is the one that actually ranks. This is the
  testable lever for W5 — re-scan after landing it before doing anything
  off-site.

⚠️ **Needs your input:** which email and which address go into `contactPoint` /
`address`. A city-level business address (Bodø, Nordland, NO) is enough for the
check and avoids publishing a home address — confirm that's what you want.

### W3 — `markdown-negotiation-vary`: acceptmarkdown.com compliance · **M, the big one**

The only outright-failed **essential** check, and the largest single score
movement available. Zero design risk — it's pure plumbing.

Current state: `Accept: text/markdown` returns `text/html`, and `Vary` is
`rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`
— no `Accept`. Without `Accept` in `Vary`, a CDN can hand the cached HTML
variant to an agent asking for markdown depending on which variant landed first.

Approach, for a fully static Next 16 App Router site:

1. **Markdown twins from the existing source of truth.** Content already lives in
   `lib/content.ts`, `lib/posts.ts`, `lib/companies.ts` — generate a `.md`
   representation per route from those, so the twins can never drift from the
   pages. Expose as `/about.md`, `/portfolio/codebase.md`, `/no/about.md`, … .
2. **Content negotiation** in `middleware.ts` (Node runtime — do **not** reach
   for `runtime = 'edge'`): if `Accept` prefers `text/markdown`, rewrite to the
   `.md` twin.
3. **`Vary: Accept, Accept-Encoding`** on every negotiated response, plus
   `Content-Type: text/markdown; charset=utf-8`.
4. **Discoverability**: `<link rel="alternate" type="text/markdown" href="…">` in
   the document head so agents don't have to probe.

Verify each route with `curl -sI -H 'Accept: text/markdown'` and assert both the
content type and the `Vary` header — that assertion is the core of
`scripts/agentic-check.mjs`.

### W4 — `agent-friendly-404`: recovery body · **S, design decision required**

Nonexistent paths already return a real HTTP 404 (Next handles this; the check
passes partially for exactly that reason). Missing: "a short markdown body
pointing agents at your sitemap, llms.txt, or docs index."

⚠️ **Design license.** `app/not-found.tsx` and `app/no/not-found.tsx` were
deliberately polished in `ec9e789` as minimal dead-ends: eyebrow, one sentence,
one pill back home. Bolting a link list onto them undoes that. Three options,
in my order of preference:

1. **Markdown-only recovery.** Once W3 lands, the 404's *markdown* variant
   carries the sitemap / llms.txt / section links, and the HTML page stays
   exactly as designed. Agents get the recovery path; humans keep the clean
   dead-end. Best of both — but confirm the scanner reads the negotiated variant
   before committing to this.
2. **One extra line.** Under the existing pill, a single muted row of three text
   links (`Home · Portfolio · Writing`) in the existing type vocabulary. Small,
   reversible, visible.
3. **Do nothing.** It's a *partial*, not a failure — the points at stake are the
   remainder of one essential check.

Pick one before implementing. Don't let an agent decide this unsupervised.

### W5 — `brand-search-accuracy` · **off-site, mostly not a code fix**

`"Codebase"` search returned 8 results, none of them this domain. The check is
about off-site authority, which overlaps the Knowledge Panel work already in
flight (plan 003).

The one *code* lever is the `WebSite` node in W2 — if the scanner then infers
"Christer Hagen" instead of "Codebase", this may flip on its own, because that
query does resolve to the domain. **Land W2, re-scan, and only then decide
whether anything off-site is warranted.** Do not chase this before that
measurement — it's the item most likely to burn effort for nothing.

### W6 — `trust-anchors`: privacy page · **S–M, needs content**

Missing `/privacy` (and the NO mirror, `/no/personvern`). Requirement is ≥ 500
characters of real content, matching the About/Contact pages that already pass.

⚠️ **Needs your input:** this is a legal/content page, not a design task — it has
to describe what the site actually does (analytics, contact form handling, what
is stored and for how long). I can draft it from what the codebase does, but you
own the final text. Add both routes to `HTML_PAGES` in `scripts/seo-check.mjs`
and to the sitemap.

### W7 — bonus signals · **only after W1–W4**

`bonus: 2.1 / 5` from 9 positive signals. Pull the full list with
`is_agentic_get_methodology` before speculating — several of the likely
candidates (stable report URLs, structured formats, OpenAPI, MCP) are things
is-agentic rewards sites for exposing, and most don't apply to a personal site.
Do not invent an API just to score points.

---

## 4. Expected outcome

| | now | after W1–W4, W6 |
|---|---|---|
| essential | 59 / 80 | ~76–80 |
| recommended | 13.3 / 20 | ~18–19 |
| bonus | 2.1 / 5 | 2.1–3 |
| **total** | **74** | **~92–96 (estimate)** |

`brand-search-accuracy` is the one item that may stay red regardless.

---

## 5. Gates

Every work item ends with:

1. `pnpm typecheck && pnpm lint && pnpm build`
2. `pnpm test`
3. `pnpm seo:check` (existing) **and** `pnpm agentic:check` (new) against a local
   `next start`
4. for W3 and W4 specifically: a real scan of the preview deployment before merge

**STOP conditions:**

- Do not implement W4 or W6 until the flagged decisions are answered.
- Do not touch typography, color, spacing or motion anywhere in this plan. The
  site is a 1:1 design import; W1 and W3 are pixel-neutral by construction, and
  W4 is the only item with a visual footprint — it's gated above.
- If a fix would require changing what a page *says*, stop and ask. Content is
  not agent-optimizable collateral.
