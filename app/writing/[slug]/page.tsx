import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { posts, postOrder, isPostSlug } from "@/lib/posts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PostContent } from "@/components/post-content"

export function generateStaticParams() {
  return postOrder.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!isPostSlug(slug)) {
    return { title: "Writing — Christer Hagen" }
  }
  const post = posts.en[slug]
  return {
    title: `${post.title} — Christer Hagen`,
    description: post.excerpt,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isPostSlug(slug)) {
    notFound()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader active="writing" />
      <PostContent slug={slug} />
      <SiteFooter />
    </div>
  )
}
