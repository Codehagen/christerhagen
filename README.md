# Christer Hagen

Personal site for Christer Hagen — founder, angel investor, and operator based in
Bodø, Norway. A warm, editorial, fully bilingual (EN / NO) site.

## Stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack, RSC)
- **[shadcn/ui](https://ui.shadcn.com)** (`base-nova` style, [Base UI](https://base-ui.com) primitives)
- **[Tailwind CSS v4](https://tailwindcss.com)**
- **Newsreader** (serif) + **JetBrains Mono** via `next/font`
- **TypeScript**, ESLint, Prettier

## Design

The visual system is a warm paper palette with serif typography and a rust accent.
shadcn tokens are themed in
`app/globals.css` so every component inherits the aesthetic; the `Badge` and
`Toggle` components carry small variants (`status`, `plain`) tailored to the design.

## Portfolio pages

The implemented surface is the portfolio company detail page — statically generated
for each company, with an EN/NO language switch persisted to `localStorage`.

```
/portfolio/<slug>     e.g. /portfolio/codebase, /portfolio/sailsdock, …
/portfolio            redirects to the first company
```

Company content lives in `lib/companies.ts` (EN + NO copy, display order, UI labels).

## Project structure

```
app/
  layout.tsx                  fonts, theme, language provider
  globals.css                 warm-paper theme tokens
  portfolio/[slug]/page.tsx   company detail page (SSG)
  portfolio/page.tsx          redirect to default company
components/
  site-header.tsx             sticky nav + EN/NO ToggleGroup
  site-footer.tsx
  company-content.tsx         language-aware article
  language-provider.tsx       SSR-safe language store
  ui/                         shadcn components
lib/
  companies.ts                bilingual portfolio data
```

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
```
