import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/seo"

/**
 * Two tiers, on purpose.
 *
 * Answer engines that cite their sources are welcome everywhere: being quoted
 * with a link back is the whole point of publishing this site. Training-only
 * crawlers, which take the text and return no attribution, are not.
 */
const ANSWER_ENGINES = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
]

const TRAINING_ONLY = ["CCBot", "Bytespider", "Amazonbot", "Omgilibot"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ANSWER_ENGINES, allow: "/" },
      { userAgent: TRAINING_ONLY, disallow: "/" },
    ],
    sitemap: siteUrl("/sitemap.xml"),
  }
}
