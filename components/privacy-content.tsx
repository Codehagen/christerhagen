import { type Lang } from "@/lib/companies"
import { privacyContent } from "@/lib/content"

import { eyebrow as label } from "@/lib/typography"

export function PrivacyContent({ lang }: { lang: Lang }) {
  const c = privacyContent[lang]

  return (
    <main id="main" className="mx-auto w-full max-w-[740px] flex-1 px-5 sm:px-7">
      <section className="pt-[88px] pb-[52px]">
        <div className={`${label} enter mb-6`}>{c.kicker}</div>
        <h1 className="enter m-0 max-w-[20ch] text-[clamp(1.875rem,9vw,2.5rem)] leading-[1.2] font-normal tracking-[-0.015em] text-(--ink-strong)">
          {c.head}
        </h1>
        <p className="enter enter-delay mt-5 max-w-[46ch] text-[1.125rem] leading-[1.6] font-normal text-(--ink-body-2)">
          {c.intro}
        </p>
        <div className="enter enter-delay mt-[14px] font-mono text-[0.75rem] leading-none font-normal text-(--ink-fainter)">
          {c.updated}
        </div>
      </section>

      <div className="border-t border-border pt-11 pb-20">
        {c.sections.map((s) => (
          <section key={s.head} className="mb-[52px] last:mb-0">
            <h2 className={`${label} mb-[18px]`}>{s.head}</h2>
            <div className="flex flex-col gap-[18px]">
              {s.body.map((para, i) => (
                <p
                  key={i}
                  className="m-0 max-w-[62ch] text-[1.03125rem] leading-[1.64] font-normal text-(--ink-body-2)"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
