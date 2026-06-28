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
  const post = posts.no[slug]
  return pageMetadata({
    path: "/writing/" + slug,
    lang: "no",
    title: post.title,
    description: post.excerpt,
    ogType: "article",
    publishedTime: posts.no[slug].dateISO,
    routeOgImage: true,
  })
}

export default async function PostPageNo({
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
      lang="no"
      className="flex min-h-svh flex-col bg-background text-foreground"
    >
      <JsonLd data={blogPostingLd(slug, "no")} />
      <JsonLd
        data={breadcrumbLd([
          { name: writingCopy.no.kicker, path: localizedPath("/writing", "no") },
          {
            name: posts.no[slug].title,
            path: localizedPath("/writing/" + slug, "no"),
          },
        ])}
      />
      <SiteHeader active="writing" lang="no" />
      <PostContent slug={slug} lang="no" />
      <SiteFooter lang="no" />
    </div>
  )
}
