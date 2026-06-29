import { Link } from "next-view-transitions"

import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { posts, postOrder, writingCopy } from "@/lib/posts"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase"

export function WritingContent({ lang }: { lang: Lang }) {
  const t = writingCopy[lang]
  const list = posts[lang]

  return (
    <main id="main" className="mx-auto w-full max-w-[740px] flex-1 px-5 sm:px-7">
      <section className="pt-[84px] pb-10">
        <h1 className={`${label} mb-[22px]`}>{t.kicker}</h1>
        <p className="m-0 max-w-[24ch] text-[clamp(22px,6.5vw,27px)] leading-[1.35] font-normal text-(--ink-strong)">
          {t.intro}
        </p>
      </section>

      <section className="border-t border-border pb-16">
        {postOrder.map((slug) => {
          const p = list[slug]
          return (
            <Link
              key={slug}
              href={localizedPath(`/writing/${slug}`, lang)}
              className="block border-b border-border py-7 text-(--ink-strong) transition-colors hover:text-(--rust-strong)"
            >
              <div className="mb-2.5 font-mono text-[11.5px] leading-none font-normal tracking-[0.04em] text-(--ink-meta)">
                {p.date} · {p.read}
              </div>
              <h2 className="mb-[9px] text-[25px] leading-[1.2] font-medium">
                {p.title}
              </h2>
              <div className="max-w-[54ch] text-[15.5px] leading-[1.5] font-normal text-(--ink-soft)">
                {p.excerpt}
              </div>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
