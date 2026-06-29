import { Link } from "next-view-transitions"
import Image from "next/image"

import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { homeContent, socialLinks, EMAIL } from "@/lib/content"

import { eyebrow as label } from "@/lib/typography"
const rowLink =
  "flex items-baseline justify-between gap-6 border-b border-border text-(--ink-strong) transition-colors hover:text-(--rust-strong)"

export function HomeContent({ lang }: { lang: Lang }) {
  const c = homeContent[lang]
  const social = socialLinks(lang)
  const location = lang === "no" ? "Bodø, Norge" : "Bodø, Norway"

  return (
    <main id="main" className="mx-auto w-full max-w-[740px] px-5 sm:px-7 pb-10">
      {/* Hero — identity above the fold: tagline + portrait, side by side. */}
      <section className="flex flex-col gap-9 pt-[72px] pb-[64px] sm:flex-row sm:items-start sm:gap-[44px]">
        <div className="min-w-0 flex-1">
          <h1 className="enter m-0 max-w-[20ch] text-[clamp(26px,7vw,33px)] leading-[1.3] font-normal tracking-[-0.015em] text-(--ink-strong)">
            {c.heroHead}
          </h1>
          <p className="enter enter-delay mt-5 max-w-[46ch] text-[18px] leading-[1.62] font-normal text-(--ink-muted)">
            {c.heroSub}
          </p>
          <p className="enter enter-delay mt-6 font-mono text-[12.5px] leading-none tracking-[0.02em] text-(--ink-faint)">
            {location}
          </p>
        </div>
        <div className="relative aspect-[236/300] w-full max-w-[236px] flex-shrink-0 overflow-hidden rounded-[3px] bg-(--paper-placeholder) sm:w-[236px]">
          <Image
            src="/images/christer-hagen-portrait.jpg"
            alt="Christer Hagen"
            fill
            priority
            sizes="236px"
            className="object-cover [object-position:center_22%]"
          />
        </div>
      </section>

      {/* About */}
      <section className="mb-[72px]">
        <h2 className={`${label} mb-6`}>{c.lblAbout}</h2>
        <p className="max-w-[62ch] text-[16.5px] leading-[1.64] font-normal text-(--ink-body-2)">
          {c.aboutBody}
        </p>
      </section>

      {/* Now */}
      <section className="mb-[72px]">
        <h2 className={`${label} mb-[22px]`}>{c.lblNow}</h2>
        <ul className="m-0 flex list-none flex-col gap-[13px] p-0">
          {c.now.map((item, i) => (
            <li
              key={i}
              className="flex gap-[14px] text-[17px] leading-[1.5] font-normal text-(--ink-body-2)"
            >
              <span aria-hidden className="flex-shrink-0 font-mono text-[14px] leading-[1.6] text-(--rust-bright)">
                →
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Work */}
      <section className="mb-[72px]">
        <h2 className={`${label} mb-1.5`}>{c.lblWork}</h2>
        {c.work.map((w) => {
          const content = (
            <>
              <span className="flex flex-col gap-1">
                <span className="text-[20px] leading-[1.15] font-medium">
                  {w.name}
                </span>
                <span className="font-mono text-[12px] leading-[1.4] font-normal text-(--ink-faint)">
                  {w.role}
                </span>
              </span>
              <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-(--ink-meta)">
                {w.period}
              </span>
            </>
          )
          // Closed companies have no live site: render a non-interactive row, not
          // a dead href="#" that opens a blank tab and exposes a no-op to AT.
          return w.url === "#" ? (
            <div
              key={w.name}
              className="flex items-baseline justify-between gap-6 border-b border-border py-4 text-(--ink-strong)"
            >
              {content}
            </div>
          ) : (
            <a
              key={w.name}
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${rowLink} py-4`}
            >
              {content}
            </a>
          )
        })}
      </section>

      {/* Investments */}
      <section className="mb-[72px]">
        <h2 className={`${label} mb-1.5`}>{c.lblInvest}</h2>
        {c.investments.map((i) => (
          <a
            key={i.name}
            href={i.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowLink} group gap-[22px] py-[15px]`}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {i.name}
              </span>
              <span className="max-w-[48ch] text-[13.5px] leading-[1.45] font-normal text-(--ink-soft)">
                {i.desc}
              </span>
            </span>
            <span
              aria-hidden
              className="flex-shrink-0 font-mono text-[13px] leading-none font-normal text-(--arrow-faint) transition-[transform,color] duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-(--rust-strong)"
            >
              ↗
            </span>
          </a>
        ))}
      </section>

      {/* Exits */}
      <section className="mb-[72px]">
        <h2 className={`${label} mb-1.5`}>{c.lblExits}</h2>
        {c.exits.map((x) => (
          <a
            key={x.name}
            href={x.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowLink} gap-[22px] py-[15px]`}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {x.name}
              </span>
              <span className="max-w-[48ch] text-[13.5px] leading-[1.45] font-normal text-(--ink-soft)">
                {x.desc}
              </span>
            </span>
            <Badge variant="status" className="flex-shrink-0">
              {x.stage}
            </Badge>
          </a>
        ))}
      </section>

      {/* Open source */}
      <section className="mb-[72px]">
        <h2 className={`${label} mb-1.5`}>{c.lblOss}</h2>
        {c.oss.map((o) => (
          <a
            key={o.name}
            href={o.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowLink} py-[15px]`}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {o.name}
              </span>
              <span className="font-mono text-[13px] leading-[1.4] font-normal text-(--ink-faint)">
                {o.desc}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-(--ink-meta)">
              <span aria-hidden>★</span> {o.stars}
            </span>
          </a>
        ))}
      </section>

      {/* Writing */}
      <section className="mb-[72px]">
        <h2 className={`${label} mb-1.5`}>{c.lblWriting}</h2>
        {c.writing.map((w) => (
          <Link
            key={w.slug}
            href={localizedPath(`/writing/${w.slug}`, lang)}
            className="flex items-baseline justify-between gap-6 border-b border-border py-[14px] text-(--ink-body-2) transition-colors hover:text-(--rust-strong)"
          >
            <span className="text-[17px] leading-[1.35] font-normal">
              {w.title}
            </span>
            <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-(--ink-meta)">
              {w.date}
            </span>
          </Link>
        ))}
      </section>

      {/* Contact */}
      <section id="contact" className="mb-10 pt-2">
        <h2 className={`${label} mb-[22px]`}>{c.lblContact}</h2>
        <p className="m-0 max-w-[16ch] text-[30px] leading-[1.25] font-normal text-(--ink-strong)">
          {c.ctaHead}
        </p>
        <p className="mt-4 mb-[26px] max-w-[42ch] text-[17px] leading-[1.6] font-normal text-(--ink-body-2)">
          {c.ctaBody}
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className={buttonVariants({ variant: "pill", size: "pill" })}
        >
          {c.ctaBtn}
        </a>
        <div className="mt-[30px] flex flex-wrap gap-[9px]">
          {social.map((s) => (
            <a
              key={s.label + s.handle}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-baseline gap-[7px] rounded-full border border-(--pill-border) px-[14px] py-[9px] font-mono text-[12.5px] leading-none font-normal text-(--ink-muted) transition-[color,border-color,transform] duration-150 ease-out hover:border-foreground hover:text-(--rust-strong) active:scale-[0.97]"
            >
              <span className="text-[9.5px] tracking-[0.06em] text-(--ink-fainter) uppercase">
                {s.label}
              </span>
              <span>{s.handle}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
