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
    return { title: "Not found" }
  }
  const post = posts.en[slug]
  return {
    title: post.title,
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

  const post = posts.en[slug]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: "Christer Hagen",
      url: "https://christerhagen.com",
    },
    url: "https://christerhagen.com/writing/" + slug,
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader active="writing" />
      <PostContent slug={slug} />
      <SiteFooter />
    </div>
  )
}
