# Plan 001: Remove `next-themes` (forced-light dead weight)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.
>
> **Drift check (run first)**:
> `git diff --stat 2332368..HEAD -- app/layout.tsx components/theme-provider.tsx package.json`
> If any of those files changed since this plan was written, compare the
> "Current state" excerpts below against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `2332368`, 2026-06-28

## Why this matters

The site uses `next-themes`, but the root layout forces the theme to light
(`forcedTheme="light"`, `enableSystem={false}`). As a result `next-themes` does
nothing a user can see, yet it costs on every page load:

1. It injects a **render-blocking synchronous inline `<script>` in `<head>`** that
   runs before first paint (the theme-init IIFE) — on a site whose theme never
   changes.
2. It ships a small client chunk and hydrates a `ThemeProvider` client component
   at the root of the tree.
3. `components/theme-provider.tsx` registers a global `keydown` listener for a
   "press **d** to toggle dark mode" hotkey that **cannot work** — `forcedTheme`
   overrides any `setTheme` call, so the hotkey is dead code.

Removing `next-themes` deletes a render-blocking pre-paint script, a dependency, a
client component boundary, and a dead event listener. The site's visuals are
unaffected because all theme tokens live on `:root` (there is no `.dark` block).

## Current state

Files involved and their role:

- `app/layout.tsx` — root layout; imports and renders `ThemeProvider` with
  forced-light props.
- `components/theme-provider.tsx` — the only file that imports `next-themes`;
  wraps `next-themes`' provider and adds the dead dark-mode hotkey.
- `package.json` — lists `next-themes` as a dependency.
- `app/globals.css` — theme tokens. **All tokens are under `:root`**; there is no
  `.dark` block (confirmed at lines 54–117). The `dark:` utility classes that
  appear in `components/ui/{button,badge,toggle}.tsx` are residual shadcn defaults
  that only activate under a `.dark` ancestor — which is never applied — so they
  are inert today and remain inert after this change.

`app/layout.tsx` today (the parts that change):

```tsx
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { SITE_URL } from "@/lib/seo"

// ... metadata ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSerif.variable, fontMono.variable)}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:font-mono focus:text-[13px] focus:text-background"
        >
          Skip to content
        </a>
        <ThemeProvider
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

`components/theme-provider.tsx` today: a `"use client"` file that re-exports
`next-themes`' provider plus a `ThemeHotkey` component. It is imported **only** by
`app/layout.tsx` (verified: `grep -rn "theme-provider" app components` returns
only the layout import).

`package.json` dependency line:

```json
    "next-themes": "^0.4.6",
```

Repo conventions: TypeScript, Prettier (2-space indent, no semicolons — see
`.prettierrc` and any existing file). `LanguageProvider` is a passthrough that
renders `{children}` and must be **kept** (it is out of scope for this plan).

## Commands you will need

| Purpose   | Command          | Expected on success      |
|-----------|------------------|--------------------------|
| Install   | `pnpm install`   | exit 0                   |
| Typecheck | `pnpm typecheck` | exit 0, no errors        |
| Lint      | `pnpm lint`      | exit 0                   |
| Build     | `pnpm build`     | exit 0, 49 static pages  |

Note: a fresh git worktree has no `node_modules` — run `pnpm install` first.

## Scope

**In scope** (the only files you should modify):
- `app/layout.tsx` (edit)
- `components/theme-provider.tsx` (delete)
- `package.json` (remove the `next-themes` dependency line)
- `pnpm-lock.yaml` (will update automatically when you run `pnpm install`)

**Out of scope** (do NOT touch, even though they look related):
- `components/language-provider.tsx` — keep the `LanguageProvider` wrapper exactly
  as-is; do not remove or inline it.
- `app/globals.css` — do not remove the `@custom-variant dark` line or any `dark:`
  classes in components. They are inert but removing them is a separate task.
- `components/ui/*.tsx` — leave their `dark:` utility classes untouched.

## Git workflow

- Work on the branch the worktree starts you on (do not create additional branches).
- One commit for this plan. Conventional-commit style (matches `git log`):
  `perf: remove next-themes (forced light, dead weight)`
- End the commit message with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Do NOT push or open a PR.

## Steps

### Step 1: Remove the `ThemeProvider` from `app/layout.tsx`

In `app/layout.tsx`:

1. Delete the import line `import { ThemeProvider } from "@/components/theme-provider"`.
2. Replace the `<ThemeProvider …> … </ThemeProvider>` wrapper with its child
   directly, so the body becomes:

```tsx
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:font-mono focus:text-[13px] focus:text-background"
        >
          Skip to content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
```

3. Remove `suppressHydrationWarning` from the `<html>` tag. It was only needed
   because `next-themes` mutated the html `class` during hydration; nothing mutates
   it anymore. The `<html>` open tag becomes:

```tsx
    <html
      lang="en"
      className={cn("antialiased", fontSerif.variable, fontMono.variable)}
    >
```

Leave the `import { LanguageProvider } …`, `cn`, font, and metadata code unchanged.

**Verify**: `grep -n "ThemeProvider\|suppressHydrationWarning" app/layout.tsx` →
no matches (exit 1).

### Step 2: Delete the theme-provider component

Delete the file `components/theme-provider.tsx`.

**Verify**: `test ! -f components/theme-provider.tsx && echo gone` → prints `gone`.

### Step 3: Remove the `next-themes` dependency

In `package.json`, delete the line `"next-themes": "^0.4.6",` from `dependencies`.
Then refresh the lockfile and `node_modules`:

```bash
pnpm install
```

**Verify**:
- `grep -rn "next-themes" app components package.json` → no matches (exit 1).
- `pnpm install` exited 0.

### Step 4: Typecheck, lint, and build

```bash
pnpm typecheck && pnpm lint && pnpm build
```

**Verify**: all three exit 0; the build reports `Generating static pages … (49/49)`.

### Step 5: Confirm the render-blocking theme script is gone

After the successful build, check the prerendered home HTML no longer contains the
`next-themes` init script. That script embeds the literal themes array
`["light","dark"]`; before this change it appears exactly once, after it should be
absent.

```bash
grep -c '\["light","dark"\]' .next/server/app/index.html
```

**Verify**: prints `0`. (If the file path differs in this Next version, instead run
`grep -rl '\["light","dark"\]' .next/server/app/ | head` and confirm it returns
nothing.)

## Test plan

This repo's test suite (`pnpm test`, Vitest) covers `lib/seo` only; there are no
component/render tests, and none are warranted for a dependency removal. Do **not**
add new tests. The verification gates above (typecheck, lint, build, and the
prerendered-HTML grep) are the regression checks.

**Verification**: `pnpm test` still exits 0 (unchanged from before).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -rn "next-themes" app components package.json` → no matches
- [ ] `test ! -f components/theme-provider.tsx` → true (file deleted)
- [ ] `grep -n "ThemeProvider\|suppressHydrationWarning" app/layout.tsx` → no matches
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0
- [ ] `pnpm build` exits 0 and generates 49 static pages
- [ ] `grep -c '\["light","dark"\]' .next/server/app/index.html` → `0`
- [ ] `pnpm test` exits 0
- [ ] No files outside the in-scope list are modified (`git status`)

## STOP conditions

Stop and report back (do not improvise) if:

- The drift check shows `app/layout.tsx`, `components/theme-provider.tsx`, or
  `package.json` changed since commit `2332368` and the live code no longer matches
  the "Current state" excerpts.
- `grep -rn "next-themes\|useTheme" app components lib` finds a usage **outside**
  `components/theme-provider.tsx` — that means another component depends on the
  theme context and removal is not safe as specified.
- `app/globals.css` contains a `.dark {` block (a real dark theme exists) — the
  premise of this plan is false.
- `pnpm build` fails, or the Step 5 grep returns a non-zero count, after one
  reasonable fix attempt.

## Maintenance notes

For whoever owns this code next:

- If a real dark mode is ever wanted, re-introducing `next-themes` (or a smaller
  custom toggle) is the path — but author a warm-paper dark token set in
  `app/globals.css` under a `.dark` block first; the current `dark:` utilities in
  `components/ui/*` are off-brand shadcn defaults and should be reviewed, not reused
  blindly.
- A reviewer should confirm the home page still renders with the warm-paper palette
  (tokens come from `:root`) and that there is no flash or hydration warning in the
  console.
- Deferred deliberately: removing the inert `@custom-variant dark` line and the
  residual `dark:` classes in `components/ui/*` — cosmetic cleanup, not required for
  this perf win.
