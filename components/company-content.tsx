import { Link } from "next-view-transitions"

import {
  companies,
  nextSlug,
  uiCopy,
  type CompanySlug,
  type Lang,
} from "@/lib/companies"
import { companyPen, type FactKey } from "@/lib/pen/companies"
import { posts, writingCopy, type PostSlug } from "@/lib/posts"
import { localizedPath } from "@/lib/seo"
import { cn } from "@/lib/utils"

import { DocdirStage } from "@/components/docdir-stage"
import { WIDE_COLUMN } from "@/components/portfolio-content"
import { Facts } from "@/components/site/ledger"
import { TextLink } from "@/components/site/link"
import { InlineNote, Ring } from "@/components/site/pen"
import { ReadNext } from "@/components/site/read-next"
import { Rule } from "@/components/site/rule"

/**
 * A company page (DESIGN.md §5; lab round-3/k/53 + _company.tsx): back to
 * Portfolio, the name, the tagline, the facts as a ledger with one green ring
 * on the fact that matters and the pen's note in the margin (under the facts
 * on a phone). A full-bleed Stage only where a real product shot exists
 * (Docdir's sales prospectus). Then the story, `Visit ↗`, the post about the
 * company if there is one, read next (the next company), and the footer.
 */

/** The post the site has written about a company. */
const RELATED: Partial<Record<CompanySlug, PostSlug>> = {
  docdir: "docdir-visma",
  refenze: "apparel-to-software",
}

export function CompanyContent({
  slug,
  lang,
}: {
  slug: CompanySlug
  lang: Lang
}) {
  const t = uiCopy[lang]
  const c = companies[lang][slug]
  const pen = companyPen[slug]
  const note = pen[lang]

  const n = nextSlug(slug)
  const next = companies[lang][n]

  const postSlug = RELATED[slug]
  const post = postSlug ? posts[lang][postSlug] : null

  const facts: [FactKey, string, string][] = [
    ["role", t.mRole, c.role],
    ["stage", t.mStage, c.stage],
    ["year", t.mYear, c.year],
    ["sector", t.mSector, c.sector],
  ]

  return (
    <main id="main" className="flex-1">
      <div className={cn(WIDE_COLUMN, "pt-9")} data-pen-column>
        <TextLink
          href={localizedPath("/portfolio", lang)}
          variant="back"
          className="press inline-flex min-h-11 items-center text-small text-ink-interactive no-underline"
        >
          <span aria-hidden>↩&nbsp;</span>
          {t.backLabel}
        </TextLink>
        <h1 className="mt-4 text-title-lg leading-[1.15] font-[var(--weight-strong)] tracking-[-0.016em]">
          {c.name}
        </h1>
        <p className="mt-[5px] text-pretty text-ink-muted">{c.tagline}</p>

        <Facts
          className="mt-[29px]"
          rows={facts.map(([key, label, value]) => ({
            key,
            label,
            value:
              key === pen.fact ? (
                <Ring note={note} srNote={note} delay={260}>
                  <span className="font-[var(--weight-strong)]">{value}</span>
                </Ring>
              ) : (
                value
              ),
          }))}
        />
        <InlineNote>{note}</InlineNote>
      </div>

      {slug === "docdir" ? (
        <DocdirStage lang={lang} captionClassName={WIDE_COLUMN} />
      ) : null}

      <div className={WIDE_COLUMN}>
        <div className={slug === "docdir" ? "" : "mt-10"}>
          {c.body.map((para, i) => (
            <p key={i} className={cn("text-pretty", i > 0 && "mt-2.5")}>
              {para}
            </p>
          ))}
          {c.site !== "#" ? (
            <p className="mt-2.5">
              <TextLink
                href={c.site}
                className="inline-flex min-h-11 min-w-11 items-center"
              >
                {t.visitLabel}
              </TextLink>
            </p>
          ) : null}
        </div>

        {post && postSlug ? (
          <>
            <Rule top={32}>{writingCopy[lang].kicker}</Rule>
            <Link
              href={localizedPath(`/writing/${postSlug}`, lang)}
              className="flex min-h-11 items-center justify-between gap-3"
            >
              <span className="ink-link">{post.title}</span>
              <span className="shrink-0 text-ink-faint tabular-nums">
                {post.date}
              </span>
            </Link>
          </>
        ) : null}

        <ReadNext
          label={t.nextLabel}
          href={localizedPath(`/portfolio/${n}`, lang)}
          title={next.name}
          meta={next.tagline}
          className="mt-[52px]"
        />
      </div>
    </main>
  )
}
