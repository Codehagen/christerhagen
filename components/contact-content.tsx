import { type Lang } from "@/lib/companies"
import { contactContent, socialLinks, EMAIL } from "@/lib/content"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase"

export function ContactContent({ lang }: { lang: Lang }) {
  const c = contactContent[lang]
  const social = socialLinks(lang)

  return (
    <main id="main" className="mx-auto w-full max-w-[740px] flex-1 px-5 sm:px-7">
      <section className="pt-[88px] pb-[60px]">
        <div className={`${label} mb-6`}>{c.kicker}</div>
        <h1 className="m-0 max-w-[16ch] text-[clamp(30px,9vw,40px)] leading-[1.2] font-normal tracking-[-0.015em] text-(--ink-strong)">
          {c.head}
        </h1>
        <p className="mt-5 max-w-[44ch] text-[18px] leading-[1.6] font-normal text-(--ink-body-2)">
          {c.body}
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-10 mb-2 inline-block max-w-full border-b-2 border-primary/40 text-[clamp(21px,6vw,30px)] leading-[1.2] break-words font-normal text-(--ink-strong) transition-colors hover:border-(--rust-strong) hover:text-(--rust-strong)"
        >
          {EMAIL}
        </a>
        <div className="mt-[14px] font-mono text-[12px] leading-none font-normal text-(--ink-fainter)">
          {c.availability}
        </div>

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

      <section className="border-t border-border pt-11 pb-20">
        <h2 className={`${label} mb-[18px]`}>{c.lookHead}</h2>
        <p className="m-0 max-w-[40ch] text-[20px] leading-[1.55] font-normal text-(--ink-body)">
          {c.lookBody}
        </p>
      </section>
    </main>
  )
}
