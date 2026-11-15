import { brandContent, type BrandSwatch } from "@/lib/brand"
import { type Lang } from "@/lib/companies"

import { Ledger } from "@/components/site/ledger"
import { Rule } from "@/components/site/rule"

/** A swatch ledger: the colour, its name, what it is for, and its value. */
function Swatches({ rows, label }: { rows: BrandSwatch[]; label: string }) {
  return (
    <Ledger
      label={label}
      columns="1fr auto"
      rows={rows.map((s) => ({
        id: s.name,
        align: { 1: "right" },
        cells: [
          <span key="n" className="flex min-w-0 items-baseline gap-[10px]">
            <span
              aria-hidden
              className="block size-[12px] shrink-0 translate-y-[1px] rounded-[3px]"
              style={{
                background: s.css,
                boxShadow: "inset 0 0 0 1px var(--hairline)",
              }}
            />
            <span className="min-w-0">
              <span className="font-[var(--weight-row)]">{s.name}</span>{" "}
              <span className="text-ink-muted">{s.use}</span>
            </span>
          </span>,
          <span
            key="v"
            className="text-small whitespace-nowrap text-ink-faint tabular-nums"
          >
            {s.value}
          </span>,
        ],
      }))}
    />
  )
}

/**
 * The brand page documents the system the site is built in (DESIGN.md §2–§3):
 * the wordmark, the ground and the greys, the pen's colours and where each one
 * is used, the two faces, and the voice. Wide column, no rail.
 */
export function BrandContent({ lang }: { lang: Lang }) {
  const c = brandContent[lang]

  return (
    <main
      id="main"
      className="px-[var(--page-pad-x)] pt-4 lg:ml-[var(--column-wide-left)] lg:w-[var(--column-wide)] lg:px-0 lg:pt-[46px]"
    >
      <p className="text-ink-muted">{c.kicker}</p>
      <h1 className="mt-[6px] text-title leading-[var(--leading-title)] font-[var(--weight-strong)] tracking-[var(--tracking-title)]">
        {c.head}
      </h1>
      <p className="mt-[10px] max-w-[var(--column)] text-ink-muted">
        {c.intro}
      </p>

      <section aria-labelledby="brand-logo">
        <Rule id="brand-logo">{c.lblLogo}</Rule>
        <div className="flex items-center gap-[14px] py-[var(--row-pad-y)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.svg"
            alt="CH monogram"
            width={48}
            height={48}
            className="size-12 rounded-[5px]"
          />
          <span className="font-[var(--weight-strong)] tracking-[-0.008em]">
            Christer Hagen
          </span>
        </div>
        <p className="mt-[10px] max-w-[var(--column)] text-small text-ink-muted">
          {c.logoNote}
        </p>
      </section>

      <section aria-labelledby="brand-colour">
        <Rule id="brand-colour">{c.lblColour}</Rule>
        <Swatches rows={c.colours} label={c.lblColour} />
      </section>

      <section aria-labelledby="brand-pen">
        <Rule id="brand-pen">{c.lblPen}</Rule>
        <p className="mb-[14px] max-w-[var(--column)]">{c.penNote}</p>
        <Swatches rows={c.pens} label={c.lblPen} />
      </section>

      <section aria-labelledby="brand-type">
        <Rule id="brand-type">{c.lblType}</Rule>
        <ul>
          {c.type.map((f, i) => (
            <li
              key={f.name}
              className="border-t py-[14px]"
              style={{ borderTopColor: i ? "var(--hairline)" : "var(--rule)" }}
            >
              <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-[var(--weight-row)]">{f.name}</span>
                <span className="text-small text-ink-faint tabular-nums">
                  {f.spec}
                </span>
              </p>
              {f.name === "Caveat" ? (
                <p
                  className="mt-[10px] font-pen text-pen-lg leading-[0.95]"
                  style={{ color: "var(--pen)" }}
                >
                  {f.sample}
                </p>
              ) : (
                <p className="mt-[10px] text-title leading-[var(--leading-title)] font-[var(--weight-strong)] tracking-[var(--tracking-title)]">
                  {f.sample}
                </p>
              )}
              <p className="mt-[6px] max-w-[var(--column)] text-small text-ink-muted">
                {f.use}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="brand-voice">
        <Rule id="brand-voice">{c.lblVoice}</Rule>
        <ul>
          {c.voice.map((v, i) => (
            <li
              key={v}
              className="border-t py-[var(--row-pad-y)]"
              style={{ borderTopColor: i ? "var(--hairline)" : "var(--rule)" }}
            >
              {v}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
