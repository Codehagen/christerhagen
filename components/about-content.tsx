import { type Lang } from "@/lib/companies"
import { aboutContent } from "@/lib/content"
import { faqItems } from "@/lib/faq"
import type { PreviewKey } from "@/lib/previews"
import { localizedPath } from "@/lib/seo"

import { LinkedText } from "@/components/linked-text"
import { Ledger } from "@/components/site/ledger"
import { TextLink } from "@/components/site/link"
import { Rail } from "@/components/site/rail"
import { Rule } from "@/components/site/rule"

/**
 * The about page (67, DESIGN.md §5): nothing above the words and no photo in
 * the column. The kicker and h1, four bio paragraphs with each company a
 * preview link at its first mention, Background as a timeline ledger, In the
 * press as headline links, and the questions the page answers in its
 * structured data. The page signs off with the small portrait and the
 * address (the footer's `signature` variant).
 */

/** Each company once, at the first place the bio names it (48/67). */
const NAMES: [string, PreviewKey][] = [
  ["Codebase", "codebase"],
  ["Docdir", "docdir"],
  ["Sailsdock", "sailsdock"],
  ["Bedrifty", "bedrifty"],
  ["Advanti Estate", "advanti-estate"],
  ["Not Another VC", "nav"],
]
const LINKS: [string, PreviewKey][][] = [
  [],
  [["Refenze", "refenze"]],
  NAMES,
  [["GitHub", "github"]],
]

const UI: Record<Lang, { rail: string; index: string; faq: string }> = {
  en: { rail: "On this page", index: "Index", faq: "Common questions" },
  no: { rail: "På denne siden", index: "Forsiden", faq: "Vanlige spørsmål" },
}

export function AboutContent({ lang }: { lang: Lang }) {
  const a = aboutContent[lang]
  const t = UI[lang]

  return (
    <main
      id="main"
      data-pen-column
      className="px-[var(--page-pad-x)] lg:ml-[var(--column-left)] lg:w-[var(--column)] lg:px-0 lg:pt-[46px]"
    >
      <Rail
        label={t.rail}
        back={{ href: localizedPath("/", lang), label: t.index }}
        items={[
          { id: "intro", label: a.kicker },
          { id: "background", label: a.lblBackground },
          { id: "press", label: a.lblPress },
        ]}
      />

      <section id="intro" aria-labelledby="about-head" className="pt-4 lg:pt-0">
        <p className="text-ink-muted">{a.kicker}</p>
        <h1
          id="about-head"
          className="mt-[6px] text-title leading-[var(--leading-title)] font-[var(--weight-strong)] tracking-[var(--tracking-title)]"
        >
          {a.head}
        </h1>
        <div className="mt-[26px] flex flex-col gap-[var(--para-gap)]">
          {a.bio.map((para, i) => (
            <LinkedText
              key={para.slice(0, 24)}
              text={para}
              links={LINKS[i] ?? []}
              lang={lang}
            />
          ))}
        </div>
      </section>

      <section id="background">
        <Rule>{a.lblBackground}</Rule>
        <Ledger
          label={a.lblBackground}
          yearWidth="2.4em"
          columns="1fr"
          rows={a.timeline.map((e) => ({
            id: e.year,
            year: e.year,
            cells: [<span key="e">{e.event}</span>],
          }))}
        />
      </section>

      <section id="press">
        <Rule>{a.lblPress}</Rule>
        <ul aria-label={a.lblPress}>
          {a.press.map((p, i) => (
            <li
              key={p.url}
              className="flex min-h-11 items-baseline justify-between gap-4 border-t py-[var(--row-pad-y)]"
              style={{ borderTopColor: i ? "var(--hairline)" : "var(--rule)" }}
            >
              <TextLink href={p.url} lang="nb" className="min-w-0 text-pretty">
                {p.title}
              </TextLink>
              <span className="shrink-0 text-small text-ink-faint tabular-nums">
                {p.outlet} · <time dateTime={p.date}>{p.date.slice(0, 4)}</time>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-faq">
        <Rule id="about-faq">{t.faq}</Rule>
        <dl>
          {faqItems[lang].map((f, i) => (
            <div
              key={f.q}
              className="border-t py-[10px]"
              style={{ borderTopColor: i ? "var(--hairline)" : "var(--rule)" }}
            >
              <dt className="font-[var(--weight-row)]">{f.q}</dt>
              <dd className="mt-1 text-ink-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
