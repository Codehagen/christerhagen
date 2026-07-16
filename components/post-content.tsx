import { Link } from "next-view-transitions"

import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { posts, nextPostSlug, writingCopy, type PostSlug } from "@/lib/posts"

export function PostContent({ slug, lang }: { slug: PostSlug; lang: Lang }) {
  const t = writingCopy[lang]
  const post = posts[lang][slug]

  const nSlug = nextPostSlug(slug)
  const next = posts[lang][nSlug]

  return (
    <main id="main" className="mx-auto w-full max-w-[620px] flex-1 px-5 sm:px-7">
      <article className="pt-[72px] pb-6">
        <Link
          href={localizedPath("/writing", lang)}
          className="mb-[38px] inline-flex items-center min-h-11 font-mono text-[0.75rem] leading-none font-medium tracking-[0.02em] text-(--ink-faint) transition-colors hover:text-(--rust-strong)"
        >
          <span aria-hidden>←</span> {t.backLabel}
        </Link>

        <div className="mb-4 font-mono text-[0.75rem] leading-none font-normal tracking-[0.04em] text-(--ink-meta)">
          {post.date} · {post.read}
        </div>
        <h1 className="m-0 mb-9 text-[clamp(1.75rem,8.5vw,2.375rem)] leading-[1.18] font-semibold tracking-[-0.015em] text-(--ink-strong)">
          {post.title}
        </h1>

        <div className="flex flex-col gap-[22px]">
          {post.body.map((para, i) => (
            <p
              key={i}
              className="m-0 text-[1.1875rem] leading-[1.66] font-normal text-(--ink-body)"
            >
              {para}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-[48px] mb-[72px] border-t border-border pt-[26px]">
        <div className="mb-3 font-mono text-[0.6875rem] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase">
          {t.readNextLabel}
        </div>
        <Link
          href={localizedPath(`/writing/${nSlug}`, lang)}
          className="inline-flex items-center min-h-11 text-[1.5rem] leading-[1.25] font-medium text-(--ink-strong) transition-colors hover:text-(--rust-strong)"
        >
          {next.title} <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  )
}
