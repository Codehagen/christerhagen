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

## Pages

Every page is statically generated and fully bilingual — an EN/NO switch in the
header is persisted to `localStorage` and shared across the site.

```
/                     Home — hero, about, now, work, investments, exits, OSS, writing, contact
/about                Bio + timeline
/portfolio            Listing: building / angel investments / exits
/portfolio/<slug>     Company detail (11 companies, e.g. /portfolio/codebase)
/writing              Essays index
/writing/<slug>       Post (3 posts) with "read next"
/process              How I work
/contact              Email + socials
```

All copy lives in `lib/` (`companies.ts`, `content.ts`, `posts.ts`) as EN + NO data.
Portrait photos live in `public/images/` (web-optimised to 600×900).

## Project structure

```
app/
  layout.tsx                  fonts, theme, language provider
  globals.css                 warm-paper theme tokens
  page.tsx                    home
  about|process|contact/      static pages
  portfolio/page.tsx          listing
  portfolio/[slug]/page.tsx   company detail (SSG)
  writing/page.tsx            essays index
  writing/[slug]/page.tsx     post (SSG)
components/
  site-header.tsx             sticky nav + EN/NO ToggleGroup (+ home CTA)
  site-footer.tsx
  *-content.tsx               language-aware page bodies
  language-provider.tsx       SSR-safe language store
  ui/                         shadcn components (Badge, Button, Toggle…)
lib/
  companies.ts                portfolio company data + UI labels
  content.ts                  home/about/portfolio/process/contact copy
  posts.ts                    writing posts
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
