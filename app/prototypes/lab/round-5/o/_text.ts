import type { Lang } from "@/lib/companies"
import { companies } from "@/lib/companies"
import { aboutContent } from "@/lib/content"
import { posts, type PostSlug } from "@/lib/posts"

import { MARKS } from "../../round-3/i/marks"

/**
 * The long post, until a real one exists: every paragraph is a sentence (or
 * several) already on the site, taken by reference from lib/ so it cannot
 * drift from the copy. Nothing here is written for the lab. The section
 * names are the rail's names from round-3/i/marks.
 */

export type Section = { name: string; paras: string[] }
export type Long = { sections: Section[] }

/** The site's sentences, split where a sentence ends. */
function said(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [text]).map((s) => s.trim())
}

function long(lang: Lang, slug: PostSlug): Long {
  const body = posts[lang][slug].body
  const bio = aboutContent[lang].bio
  const rail = MARKS[lang][slug].rail
  const c = companies[lang]
  const farFromTheCapital = said(bio[3])[1]

  if (slug === "docdir-visma") {
    return {
      sections: [
        { name: rail[0], paras: [body[0], said(c.docdir.body[0])[0]] },
        { name: rail[1], paras: [body[1]] },
        { name: rail[2], paras: [body[2], farFromTheCapital] },
      ],
    }
  }
  if (slug === "building-in-bodo") {
    return {
      sections: [
        { name: rail[0], paras: [body[0]] },
        { name: rail[1], paras: [body[1], bio[0]] },
        { name: rail[2], paras: [body[2], farFromTheCapital] },
      ],
    }
  }
  return {
    sections: [
      { name: rail[0], paras: [body[0]] },
      { name: rail[1], paras: [body[1], said(c.refenze.body[1])[0]] },
      { name: rail[2], paras: [body[2]] },
    ],
  }
}

export function longPost(lang: Lang, slug: PostSlug): Long {
  return long(lang, slug)
}
