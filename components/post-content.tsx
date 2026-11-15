import { type Lang } from "@/lib/companies"
import { POST_PEN, cut } from "@/lib/pen/posts"
import { posts, nextPostSlug, writingCopy, type PostSlug } from "@/lib/posts"
import { localizedPath } from "@/lib/seo"

import { DocdirStage, LastMark, MarginBracket } from "@/components/post-marks"
import { Highlight, InlineNote, PenToggle, RingArrow } from "@/components/site/pen"
import { Rail } from "@/components/site/rail"

const RAIL_LABEL: Record<Lang, string> = {
  en: "On this page",
  no: "På denne siden",
}

/**
 * The post (41 desktop, 42 phone, 44, 45; DESIGN.md §5 Post).
 *
 * The rail: `↩ All writing`, the post's three sections, the PenToggle at its
 * foot. The column from 28%: date · read, the title, three paragraphs that
 * are the rail's sections, each carrying one of the pen's marks (bracket,
 * ring + arrow, highlighter) with its note in the right margin. 44's one
 * product shot on the wall follows the Docdir post's first paragraph. Read
 * next, with 45's last mark beside it.
 *
 * Phone (42): the rail is a strip under the header row; the notes are
 * written under their paragraph; no bracket, no arrows.
 *
 * Put it inside `<PenProvider color="blue">`, header and footer included.
 */
export function PostContent({ slug, lang }: { slug: PostSlug; lang: Lang }) {
  const t = writingCopy[lang]
  const post = posts[lang][slug]
  const pen = POST_PEN[lang][slug]

  const nSlug = nextPostSlug(slug)
  const next = posts[lang][nSlug]

  const paragraph = (text: string, p: number) => {
    if (pen.ring.p === p) {
      const [a, b, c] = cut(text, pen.ring.phrase)
      return (
        <>
          <p className="text-pretty">
            {a}
            <RingArrow note={pen.ring.note}>{b}</RingArrow>
            {c}
          </p>
          <InlineNote>{pen.ring.note}</InlineNote>
        </>
      )
    }
    if (pen.hl.p === p) {
      const [a, b, c] = cut(text, pen.hl.phrase)
      return (
        <>
          <p className="text-pretty">
            {a}
            <Highlight note={pen.hl.note}>{b}</Highlight>
            {c}
          </p>
          <InlineNote>{pen.hl.note}</InlineNote>
        </>
      )
    }
    const plain = <p className="text-pretty">{text}</p>
    return pen.bracket.p === p ? (
      <MarginBracket note={pen.bracket.note}>{plain}</MarginBracket>
    ) : (
      plain
    )
  }

  return (
    <main
      id="main"
      className="flex-1 px-[var(--page-pad-x)] lg:px-0 [&>nav[data-site-rail]]:-mx-[var(--page-pad-x)] [&>nav[data-site-rail]]:px-[var(--page-pad-x)]"
    >
      <Rail
        label={RAIL_LABEL[lang]}
        back={{ href: localizedPath("/writing", lang), label: t.backLabel }}
        items={pen.sections.map((s) => ({ id: s.id, label: s.label }))}
      >
        <PenToggle lang={lang} />
      </Rail>

      <article
        data-pen-column
        className="pt-[42px] lg:ml-[var(--column-left)] lg:w-[var(--column)]"
      >
        <header className="mb-6">
          <p className="mb-2 text-micro tracking-[var(--tracking-caps)] text-ink-muted tabular-nums">
            <time dateTime={post.dateISO}>{post.date}</time> · {post.read}
          </p>
          <h1 className="text-title leading-[var(--leading-title)] font-[560] tracking-[var(--tracking-title)] text-balance">
            {post.title}
          </h1>
        </header>

        {post.body.map((text, p) => {
          const s = pen.sections[p]
          return (
            <section
              key={s.id}
              id={s.id}
              className="relative scroll-mt-[12vh] [&+&]:mt-[var(--para-gap)]"
            >
              <h2 className="sr-only">
                {s.label}
              </h2>
              {paragraph(text, p)}
              {slug === "docdir-visma" && p === 0 ? (
                <DocdirStage lang={lang} />
              ) : null}
            </section>
          )
        })}

        <LastMark
          note={pen.next}
          label={t.readNextLabel}
          href={localizedPath(`/writing/${nSlug}`, lang)}
          title={next.title}
          meta={`${next.date} · ${next.read}`}
        />
      </article>
    </main>
  )
}
