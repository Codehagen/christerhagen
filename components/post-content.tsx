"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { posts, nextPostSlug, writingCopy, type PostSlug } from "@/lib/posts"

export function PostContent({ slug }: { slug: PostSlug }) {
  const { lang } = useLanguage()
  const t = writingCopy[lang]
  const post = posts[lang][slug]

  const nSlug = nextPostSlug(slug)
  const next = posts[lang][nSlug]

  return (
    <main className="mx-auto w-full max-w-[620px] flex-1 px-[28px]">
      <article className="pt-[72px] pb-6">
        <Link
          href="/writing"
          className="mb-[38px] inline-block font-mono text-[12px] leading-none font-medium tracking-[0.02em] text-(--ink-faint) transition-colors hover:text-(--rust-strong)"
        >
          ← {t.backLabel}
        </Link>

        <div className="mb-4 font-mono text-[12px] leading-none font-normal tracking-[0.04em] text-[#B0A893]">
          {post.date} · {post.read}
        </div>
        <h1 className="m-0 mb-9 text-[38px] leading-[1.18] font-semibold tracking-[0.004em] text-(--ink-strong)">
          {post.title}
        </h1>

        <div className="flex flex-col gap-[22px]">
          {post.body.map((para, i) => (
            <p
              key={i}
              className="m-0 text-[19px] leading-[1.66] font-normal text-(--ink-body)"
            >
              {para}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-[48px] mb-[72px] border-t border-border pt-[26px]">
        <div className="mb-3 font-mono text-[11px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase">
          {t.readNextLabel}
        </div>
        <Link
          href={`/writing/${nSlug}`}
          className="text-[24px] leading-[1.25] font-medium text-(--ink-strong) transition-colors hover:text-(--rust-strong)"
        >
          {next.title} →
        </Link>
      </div>
    </main>
  )
}
