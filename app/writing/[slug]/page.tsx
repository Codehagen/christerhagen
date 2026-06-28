import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { posts, postOrder, isPostSlug } from "@/lib/posts"
import { blogPostingLd, breadcrumbLd } from "@/lib/seo"
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
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: "/writing/" + slug },
    openGraph: {
      url: "/writing/" + slug,
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: posts.en[slug].dateISO,
    },
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
      <JsonLd data={blogPostingLd(slug)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Writing", path: "/writing" },
          { name: posts.en[slug].title, path: "/writing/" + slug },
        ])}
      />
      <SiteHeader active="writing" />
      <PostContent slug={slug} />
      <SiteFooter />
    </div>
  )
}
