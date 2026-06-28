import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { posts, postOrder, isPostSlug, writingCopy } from "@/lib/posts"
import { blogPostingLd, breadcrumbLd, localizedPath, pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"
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
  return pageMetadata({
    path: "/writing/" + slug,
    lang: "en",
    title: post.title,
    description: post.excerpt,
    ogType: "article",
    publishedTime: posts.en[slug].dateISO,
    routeOgImage: true,
  })
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
    <div
      lang="en"
      className="flex min-h-svh flex-col bg-background text-foreground"
    >
      <JsonLd data={blogPostingLd(slug, "en")} />
      <JsonLd
        data={breadcrumbLd([
          { name: writingCopy.en.kicker, path: localizedPath("/writing", "en") },
          {
            name: posts.en[slug].title,
            path: localizedPath("/writing/" + slug, "en"),
          },
        ])}
      />
      <SiteHeader active="writing" lang="en" />
      <PostContent slug={slug} lang="en" />
      <SiteFooter lang="en" />
    </div>
  )
}
