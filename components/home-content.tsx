import { type Lang } from "@/lib/companies"
import { homeContent, homeSectionNames } from "@/lib/content"
import { HOME_PEN } from "@/lib/pen/pages"
import { postOrder, posts, writingCopy } from "@/lib/posts"
import type { PreviewKey } from "@/lib/previews"
import { localizedPath } from "@/lib/seo"

import { LinkedText } from "@/components/linked-text"
import { Ledger, LedgerTitle } from "@/components/site/ledger"
import { TextLink } from "@/components/site/link"
import { NowBefore } from "@/components/site/now-before"
import { Highlight } from "@/components/site/pen"
import { TonedPortrait } from "@/components/site/portrait"
import { Rail } from "@/components/site/rail"
import { Rule } from "@/components/site/rule"

/**
 * The home page (64, DESIGN.md §5): the name at body size with the role under
 * it, the toned portrait in the right margin, one paragraph with preview
 * links, the writing ledger with the newest under the rose wash and its note,
 * and the work as now / before. The rail reads About · Writing · Work.
 */

/** The paragraph's named things, each once (46/64). */
const LINKS: Record<Lang, [string, PreviewKey][]> = {
  en: [
    ["Codebase", "codebase"],
    ["Not Another VC", "nav"],
    ["Advanti Estate", "advanti-estate"],
    ["writes software in the open", "github"],
    ["Docdir", "docdir"],
  ],
  no: [
    ["Codebase", "codebase"],
    ["Not Another VC", "nav"],
    ["Advanti Estate", "advanti-estate"],
    ["skriver programvare i åpen kildekode", "github"],
    ["Docdir", "docdir"],
  ],
}

const UI: Record<Lang, { rail: string; before: string }> = {
  en: { rail: "On this page", before: "Before" },
  no: { rail: "På denne siden", before: "Før" },
}

/** "2026-02-15" → "15/02". */
function ddmm(iso: string) {
  const [, m, d] = iso.split("-")
  return `${d}/${m}`
}

export function HomeContent({ lang }: { lang: Lang }) {
  const c = homeContent[lang]
  const names = homeSectionNames[lang]
  const t = UI[lang]

  const rows = [...postOrder]
    .map((slug) => ({ slug, ...posts[lang][slug] }))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))

  const work = c.work.map((w) => ({
    name: w.name,
    what: w.role.split(" · ")[1],
    period: w.period,
  }))
  const now = work
    .filter((w) => !w.period.startsWith("Sunset"))
    .map((w) => ({
      ...w,
      period: w.period.replace(/^(Since|Siden) /, (m) => m.toLowerCase()),
    }))
  const before = work
    .filter((w) => w.period.startsWith("Sunset"))
    .map((w) => ({ ...w, period: w.period.replace(/^Sunset · /, "") }))

  return (
    <main
      id="main"
      data-pen-column
      className="px-[var(--page-pad-x)] lg:ml-[var(--column-left)] lg:w-[var(--column)] lg:px-0 lg:pt-[46px]"
    >
      <Rail
        label={t.rail}
        items={[
          { id: "about", label: c.lblAbout },
          { id: "writing", label: c.lblWriting },
          { id: "work", label: c.lblWork },
        ]}
      />
      <section
        id="about"
        aria-labelledby="home-name"
        className="relative pt-4 lg:pt-0"
      >
        <h1
          id="home-name"
          className="font-[var(--weight-strong)] tracking-[-0.008em]"
        >
          Christer Hagen
        </h1>
        <p className="text-ink-muted">{c.aboutRole}</p>
        <TonedPortrait lang={lang} />
        <LinkedText
          text={c.aboutBody}
          links={LINKS[lang]}
          lang={lang}
          className="mt-[21px]"
        />
      </section>

      <section id="writing">
        <Rule>
          {c.lblWriting}
          <span className="sr-only"> {names.writing}</span>
        </Rule>
        <Ledger
          label={c.lblWriting}
          columns="1fr auto auto"
          rows={rows.map((p, i) => ({
            id: p.slug,
            year: p.dateISO.slice(0, 4),
            href: localizedPath(`/writing/${p.slug}`, lang),
            rest: i > 0,
            align: { 2: "right" },
            cells: [
              <LedgerTitle key="t">
                {i === 0 ? (
                  <Highlight
                    variant="title"
                    stepBack
                    noteVariant="settle"
                    note={HOME_PEN[lang].newest}
                  >
                    {p.title}
                  </Highlight>
                ) : (
                  p.title
                )}
              </LedgerTitle>,
              <span key="r" className="whitespace-nowrap text-ink-muted">
                {p.read}
              </span>,
              <span key="d" className="text-ink-muted">
                {ddmm(p.dateISO)}
              </span>,
            ],
          }))}
        />
        <p className="mt-[10px] text-small leading-[var(--leading-meta)]">
          <TextLink
            href={localizedPath("/writing", lang)}
            variant="back"
            className="hit text-ink-muted"
          >
            {writingCopy[lang].backLabel} →
          </TextLink>
        </p>
      </section>

      <section id="work">
        <Rule>
          {c.lblWork}
          <span className="sr-only"> {names.work}</span>
        </Rule>
        <NowBefore now={now} before={before} beforeLabel={t.before} />
      </section>
    </main>
  )
}
