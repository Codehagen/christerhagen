"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { posts, postOrder, writingCopy } from "@/lib/posts"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase"

export function WritingContent() {
  const { lang } = useLanguage()
  const t = writingCopy[lang]
  const list = posts[lang]

  return (
    <main className="mx-auto w-full max-w-[740px] flex-1 px-[28px]">
      <section className="pt-[84px] pb-10">
        <div className={`${label} mb-[22px]`}>{t.kicker}</div>
        <p className="m-0 max-w-[24ch] text-[27px] leading-[1.35] font-normal text-(--ink-strong)">
          {t.intro}
        </p>
      </section>

      <section className="border-t border-border pb-16">
        {postOrder.map((slug) => {
          const p = list[slug]
          return (
            <Link
              key={slug}
              href={`/writing/${slug}`}
              className="block border-b border-border py-7 text-(--ink-strong) transition-colors hover:text-(--rust-strong)"
            >
              <div className="mb-2.5 font-mono text-[11.5px] leading-none font-normal tracking-[0.04em] text-[#B0A893]">
                {p.date} · {p.read}
              </div>
              <div className="mb-[9px] text-[25px] leading-[1.2] font-medium">
                {p.title}
              </div>
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
