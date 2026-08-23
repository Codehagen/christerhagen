/**
 * The tools the MCP server exposes, and the work behind them.
 *
 * Everything here reads the same content modules the pages render — there is no
 * second copy of the facts, and no capability claimed that the site does not
 * actually have.
 */
import { companies, companyOrder, type CompanySlug } from "@/lib/companies"
import { posts, postOrder } from "@/lib/posts"
import { markdownFor, markdownPaths } from "@/lib/markdown"
import { CONTACT_EMAIL, SITE_URL } from "@/lib/seo"

export interface ToolDefinition {
  name: string
  title: string
  description: string
  inputSchema: Record<string, unknown>
  annotations: { readOnlyHint: true; openWorldHint: false }
  run: (args: Record<string, unknown>) => string
}

/** Every tool here only reads public content — nothing mutates, nothing leaves. */
const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const

function fail(message: string): never {
  throw new Error(message)
}

function requireString(
  args: Record<string, unknown>,
  key: string,
  fallback?: string
): string {
  const value = args[key]
  if (value === undefined || value === null) {
    if (fallback !== undefined) return fallback
    fail(`Missing required argument "${key}".`)
  }
  if (typeof value !== "string") fail(`Argument "${key}" must be a string.`)
  return value
}

/* -------------------------------------------------------------------- tools */

function searchSite(args: Record<string, unknown>): string {
  const query = requireString(args, "query").trim().toLowerCase()
  if (!query) fail('Argument "query" must not be empty.')
  const limit = Math.min(Number(args.limit ?? 5) || 5, 20)

  const hits = markdownPaths()
    .filter((path) => !path.startsWith("/no"))
    .map((path) => {
      const body = markdownFor(path) ?? ""
      const haystack = body.toLowerCase()
      const at = haystack.indexOf(query)
      if (at === -1) return null
      const occurrences = haystack.split(query).length - 1
      const start = Math.max(0, at - 120)
      const snippet = body
        .slice(start, at + query.length + 200)
        .replace(/\s+/g, " ")
        .trim()
      return { path, url: SITE_URL + path, occurrences, snippet }
    })
    .filter((hit): hit is NonNullable<typeof hit> => hit !== null)
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, limit)

  if (hits.length === 0) {
    return `No page on ${SITE_URL} contains "${query}".`
  }
  return hits
    .map((h) => `## ${h.url}\n\n…${h.snippet}…`)
    .join("\n\n")
}

function getPage(args: Record<string, unknown>): string {
  let path = requireString(args, "path", "/")
  if (!path.startsWith("/")) path = "/" + path
  const body = markdownFor(path)
  if (body === null) {
    fail(
      `No page at "${path}". Call list_pages for the full list of valid paths.`
    )
  }
  return body
}

function listPages(): string {
  return markdownPaths()
    .map((path) => `- ${SITE_URL}${path}`)
    .join("\n")
}

function listVentures(args: Record<string, unknown>): string {
  const relation = requireString(args, "relation", "all")
  if (!["all", "founded", "backed"].includes(relation)) {
    fail('Argument "relation" must be one of: all, founded, backed.')
  }

  const rows = companyOrder
    .map((slug: CompanySlug) => {
      const c = companies.en[slug]
      // Founder vs funder is the one distinction agents get wrong about this
      // site, so it is the first field on every row.
      const founded = c.role.includes("Founder")
      return { slug, c, founded }
    })
    .filter(({ founded }) =>
      relation === "all" ? true : relation === "founded" ? founded : !founded
    )

  if (rows.length === 0) return "No ventures match that filter."

  return rows
    .map(
      ({ slug, c, founded }) =>
        `- **${c.name}** — ${founded ? "founded by" : "backed by"} Christer Hagen\n` +
        `  - Role: ${c.role}\n` +
        `  - Stage: ${c.stage} · Year: ${c.year} · Sector: ${c.sector}\n` +
        `  - Status: ${c.status}\n` +
        `  - Details: ${SITE_URL}/portfolio/${slug}`
    )
    .join("\n")
}

function getProfile(): string {
  return [
    "# Christer Hagen",
    "",
    "- Role: Norwegian serial entrepreneur and software developer",
    "- Based in: Bodø, Nordland, Norway",
    "- Founder of: Codebase (technology studio), Not Another Venture Capital (pre-seed angel fund)",
    "- Notable exit: sold Docdir, his AI company for real-estate sales documents, to Visma in 2026",
    `- Canonical entity: ${SITE_URL}/#christer`,
    "- Wikidata: https://www.wikidata.org/wiki/Q140373910",
    `- Contact: ${CONTACT_EMAIL}`,
    "- LinkedIn: https://www.linkedin.com/in/christerhagen",
    "- GitHub: https://github.com/Codehagen",
    "- X: https://x.com/CodeHagen",
    "",
    `Full profile: ${SITE_URL}/about`,
  ].join("\n")
}

function listWriting(): string {
  return postOrder
    .map((slug) => {
      const p = posts.en[slug]
      return `- **${p.title}** (${p.date}, ${p.read})\n  - ${p.excerpt}\n  - ${SITE_URL}/writing/${slug}`
    })
    .join("\n")
}

/* -------------------------------------------------------------------- table */

export const TOOLS: ToolDefinition[] = [
  {
    name: "search_site",
    title: "Search christerhagen.com",
    description:
      "Full-text search across every page of christerhagen.com. Returns matching pages with a surrounding snippet, ranked by number of matches. Use this when you do not already know which page holds the answer.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            'The text to search for, for example "Docdir" or "angel investing".',
          minLength: 1,
        },
        limit: {
          type: "integer",
          description: "Maximum number of pages to return. Defaults to 5.",
          minimum: 1,
          maximum: 20,
          default: 5,
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    run: searchSite,
  },
  {
    name: "get_page",
    title: "Read one page as markdown",
    description:
      'Fetch the full markdown of one page by its path, for example "/about" or "/portfolio/codebase". Norwegian versions live under "/no". Call list_pages first if you do not know the path.',
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: 'Site path beginning with "/". Defaults to the home page.',
          default: "/",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    run: getPage,
  },
  {
    name: "list_pages",
    title: "List every page",
    description:
      "List every page URL on christerhagen.com, in both English and Norwegian. Cheap; call it before guessing a path.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: READ_ONLY,
    run: listPages,
  },
  {
    name: "list_ventures",
    title: "List companies founded and backed",
    description:
      "List the companies Christer Hagen founded and the ones he only invested in, with role, stage, year, sector and status. Use the relation filter to keep the two apart — conflating them is the most common error about this site.",
    inputSchema: {
      type: "object",
      properties: {
        relation: {
          type: "string",
          description:
            'Which companies to return: "founded" for ones he started, "backed" for ones he only invested in, "all" for both.',
          enum: ["all", "founded", "backed"],
          default: "all",
        },
      },
      required: [],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    run: listVentures,
  },
  {
    name: "list_writing",
    title: "List essays",
    description:
      "List the essays and notes published on christerhagen.com, with publication year, reading time and excerpt.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: READ_ONLY,
    run: listWriting,
  },
  {
    name: "get_profile",
    title: "Get Christer Hagen's identity facts",
    description:
      "The canonical identity facts about Christer Hagen — role, location, companies founded, exits, Wikidata entity and contact details. Use this to verify who he is rather than inferring it from page text.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: READ_ONLY,
    run: getProfile,
  },
]

export const TOOLS_BY_NAME = new Map(TOOLS.map((tool) => [tool.name, tool]))
