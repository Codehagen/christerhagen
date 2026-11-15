import { ogCard, OG_SIZE } from "@/lib/og-card"
import { postOgNote } from "@/lib/pen/posts"
import { posts, postOrder, isPostSlug } from "@/lib/posts"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Christer Hagen"

export function generateStaticParams() {
  return postOrder.map((slug) => ({ slug }))
}

// A post card: the title, "date · read" as on the post, and the post's blue
// pen with one of its own notes (lib/pen/posts.ts postOgNote) in the margin.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isPostSlug(slug)) {
    return ogCard({
      eyebrow: "Christer Hagen",
      title: "Writing",
      meta: { text: "christerhagen.com" },
      pen: "blue",
    })
  }
  const post = posts.en[slug]
  return ogCard({
    eyebrow: "Christer Hagen",
    title: post.title,
    meta: { text: `${post.date} · ${post.read}` },
    pen: "blue",
    note: postOgNote("en", slug),
  })
}
