# Plan 002: Enable AVIF/WebP image optimization

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.
>
> **Drift check (run first)**:
> `git diff --stat 2332368..HEAD -- next.config.ts`
> If `next.config.ts` changed since this plan was written, compare the
> "Current state" excerpt below against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `2332368`, 2026-06-28

## Why this matters

`next.config.ts` is empty, so `next/image` optimizes to **WebP only** (the build's
`images-manifest.json` reports `formats: ['image/webp']`). The site's portraits
ship as JPEG source (`public/images/christer-hagen-portrait.jpg` ≈ 62 KB,
`christer-hagen-working.jpg` ≈ 66 KB) and are served as WebP. Adding AVIF as the
first preferred format lets the optimizer serve AVIF to the ~95% of browsers that
support it, which is typically **40–55% smaller than WebP** at equal quality — a
direct LCP and bandwidth win on `/` and `/about`, where the portraits render via
`next/image`. Browsers that don't accept AVIF transparently fall back to WebP, then
the JPEG original, via content negotiation — no code changes elsewhere.

## Current state

`next.config.ts` in full today:

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {}

export default nextConfig
```

Image usage (already correct — do not change these):

- `components/home-content.tsx` — `<Image src="/images/christer-hagen-portrait.jpg" fill sizes="236px" … />`
- `components/about-content.tsx` — imports `next/image`, renders the portrait.

Default formats confirmed via `.next/images-manifest.json` → `images.formats` is
`['image/webp']` (AVIF not enabled).

Repo conventions: TypeScript, Prettier (2-space indent, no semicolons — match the
existing `next.config.ts`). This is a Next.js 16 project; `images.formats` is the
supported, stable key for this (verify against
`node_modules/next/dist/docs/` if anything looks different — see AGENTS.md).

## Commands you will need

| Purpose   | Command          | Expected on success     |
|-----------|------------------|-------------------------|
| Install   | `pnpm install`   | exit 0                  |
| Typecheck | `pnpm typecheck` | exit 0, no errors       |
| Build     | `pnpm build`     | exit 0, 49 static pages |

Note: a fresh git worktree has no `node_modules` — run `pnpm install` first.

## Scope

**In scope** (the only file you should modify):
- `next.config.ts`

**Out of scope** (do NOT touch):
- `components/home-content.tsx`, `components/about-content.tsx`, or any image
  markup — the `<Image>` usage is already correct.
- `public/images/*` — do not re-encode or replace the source images.
- Do not add `remotePatterns`, `qualities`, `deviceSizes`, `minimumCacheTTL`, or
  any other image option; this plan changes **only** `formats`.

## Git workflow

- Work on the branch the worktree starts you on (do not create additional branches).
- One commit for this plan. Conventional-commit style (matches `git log`):
  `perf(images): enable AVIF/WebP optimization`
- End the commit message with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Do NOT push or open a PR.

## Steps

### Step 1: Add the `images.formats` config

Edit `next.config.ts` to read exactly:

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
```

Order matters: `image/avif` must come first so the optimizer prefers AVIF and
falls back to WebP.

**Verify**: `grep -n "image/avif" next.config.ts` → one match.

### Step 2: Typecheck and build

```bash
pnpm install && pnpm typecheck && pnpm build
```

**Verify**: both `typecheck` and `build` exit 0; the build reports
`Generating static pages … (49/49)`.

### Step 3: Confirm AVIF is now the preferred format

After the build, read the formats out of the generated image manifest:

```bash
python3 -c "import json; print(json.load(open('.next/images-manifest.json'))['images']['formats'])"
```

**Verify**: prints `['image/avif', 'image/webp']` (was `['image/webp']` before).

### Step 4 (optional, stronger): Verify the optimizer returns AVIF at runtime

Only if `python3` is unavailable or you want end-to-end proof. Start the production
server, request a portrait with an AVIF-accepting `Accept` header, and check the
response content type:

```bash
pnpm start &
SERVER_PID=$!
sleep 4
curl -s -o /dev/null -w "%{content_type}\n" \
  -H "Accept: image/avif,image/webp,*/*" \
  "http://localhost:3000/_next/image?url=%2Fimages%2Fchrister-hagen-portrait.jpg&w=640&q=75"
kill $SERVER_PID
```

**Verify**: the printed content type is `image/avif`.

## Test plan

No unit tests apply to a build-config change, and the existing Vitest suite
(`lib/seo` only) is unaffected. Do **not** add tests. The manifest check in Step 3
(and optionally the runtime check in Step 4) is the verification.

**Verification**: `pnpm test` still exits 0 (unchanged).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `next.config.ts` contains `formats: ["image/avif", "image/webp"]` with avif first
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm build` exits 0 and generates 49 static pages
- [ ] `.next/images-manifest.json` → `images.formats` is `['image/avif', 'image/webp']`
- [ ] `pnpm test` exits 0
- [ ] No files outside `next.config.ts` (and the auto-updated lockfile, if any) are modified (`git status`)

## STOP conditions

Stop and report back (do not improvise) if:

- The drift check shows `next.config.ts` changed since commit `2332368` and no
  longer matches the "Current state" excerpt.
- `pnpm build` fails with an error referencing `images` or `formats` (the config
  key may have moved in this Next version — check `node_modules/next/dist/docs/`
  and report what you find rather than guessing an alternative key).
- The Step 3 manifest still reports only `['image/webp']` after a clean rebuild
  (`rm -rf .next && pnpm build`).

## Maintenance notes

For whoever owns this code next:

- AVIF encoding is slightly slower to generate on first request than WebP, but
  Vercel caches optimized images, so the cost is one-time per size/quality. No
  action needed.
- If portrait quality ever looks off, tune via the `<Image quality>` prop or an
  `images.qualities` config — not by removing AVIF.
- A reviewer should confirm the `/` and `/about` portraits still render correctly
  and that the network panel shows `image/avif` responses in a supporting browser.
- Deferred deliberately (kept out of scope to keep the change atomic):
  `poweredByHeader: false` and other `next.config` hardening — worthwhile but
  separate from this image-format change.
