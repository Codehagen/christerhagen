#!/usr/bin/env node
// Local mirror of the deterministic parts of the is-agentic.com rubric.
// Assumes a server is already running at BASE_URL.
// Usage: BASE_URL=http://localhost:3100 node scripts/agentic-check.mjs
//
// This is NOT the scorer. It is the fast inner loop: it catches the regressions
// that would cost points before a deploy, so the real scan (npx is-agentic
// www.christerhagen.com) only has to confirm.

const BASE_URL = process.env.BASE_URL || "http://localhost:3100"

const PAGES = [
  "/",
  "/about",
  "/portfolio",
  "/portfolio/codebase",
  "/writing",
  "/writing/docdir-visma",
  "/process",
  "/contact",
  "/brand",
  "/privacy",
  "/no",
  "/no/about",
  "/no/portfolio",
  "/no/portfolio/codebase",
  "/no/writing",
  "/no/writing/docdir-visma",
  "/no/process",
  "/no/contact",
  "/no/brand",
  "/no/privacy",
]

const results = []
function record(name, pass, detail = "") {
  results.push({ name, pass, detail })
}

async function get(path, headers = {}) {
  const res = await fetch(BASE_URL + path, { headers, redirect: "manual" })
  return { res, body: await res.text() }
}

function headingCounts(html) {
  const counts = { h1: 0, h2: 0, h3: 0 }
  for (const m of html.matchAll(/<h([1-3])[\s>]/g)) counts["h" + m[1]] += 1
  return counts
}

/** Strip the YAML frontmatter block so assertions can look at the body. */
function stripFrontmatter(md) {
  return md.startsWith("---") ? md.replace(/^---\n[\s\S]*?\n---\n+/, "") : md
}

function textLength(html) {
  const stripped = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
  return stripped.split(/\s+/).filter(Boolean).join(" ").length
}

/* ------------------------------------- markdown content negotiation (Accept) */

async function checkMarkdownNegotiation() {
  for (const path of PAGES) {
    const { res, body } = await get(path, { Accept: "text/markdown" })
    const type = res.headers.get("content-type") || ""
    const vary = (res.headers.get("vary") || "").toLowerCase()

    record(
      `markdown negotiation ${path}`,
      res.status === 200 && type.includes("text/markdown"),
      `${res.status} ${type}`
    )
    // Accept must be in Vary or a CDN can serve the HTML variant to an agent.
    // "accept-encoding" also contains "accept", so match the bare token.
    const hasAccept = vary
      .split(",")
      .some((t) => t.trim() === "accept")
    record(`Vary: Accept on ${path}`, hasAccept, vary || "(no vary)")
    record(
      `markdown body ${path}`,
      stripFrontmatter(body).trimStart().startsWith("#") && body.length > 200,
      `${body.length} chars`
    )
    // Frontmatter is what saves an agent from scraping the body for metadata.
    record(
      `markdown frontmatter ${path}`,
      body.startsWith("---") &&
        /\ntitle: "/.test(body) &&
        /\ncanonical: "/.test(body) &&
        /\nlast_updated: "/.test(body)
    )
  }
}

/* ----------------------------------------------------- markdown .md suffixes */

async function checkMarkdownSuffix() {
  for (const path of ["/index.md", "/about.md", "/no/about.md", "/privacy.md"]) {
    const { res, body } = await get(path)
    record(
      `.md suffix ${path}`,
      res.status === 200 &&
        (res.headers.get("content-type") || "").includes("text/markdown") &&
        stripFrontmatter(body).trimStart().startsWith("#"),
      `${res.status} ${res.headers.get("content-type")}`
    )
  }
}

/* ---------------------------------------------------------- agent-friendly 404 */

async function check404() {
  const path = "/this-page-does-not-exist-" + "check"

  const html = await get(path)
  record(`404 status (html) ${path}`, html.res.status === 404, `${html.res.status}`)
  // A dead end that lists nowhere to go is a dead end an agent cannot leave.
  const hasRecovery =
    html.body.includes("/sitemap.xml") && html.body.includes("/llms.txt")
  record("404 html links to sitemap + llms.txt", hasRecovery)

  const md = await get(path, { Accept: "text/markdown" })
  record(
    "404 markdown body",
    md.res.status === 404 &&
      (md.res.headers.get("content-type") || "").includes("text/markdown") &&
      md.body.includes("/sitemap.xml") &&
      md.body.includes("/llms.txt"),
    `${md.res.status} ${md.res.headers.get("content-type")}`
  )
}

/* ------------------------------------------------- server-rendered structure */

async function checkStructure() {
  for (const path of PAGES) {
    const { body } = await get(path)
    const h = headingCounts(body)
    record(
      `single h1 ${path}`,
      h.h1 === 1,
      `h1=${h.h1} h2=${h.h2} h3=${h.h3}`
    )
    record(
      `content length ${path}`,
      textLength(body) >= 500,
      `${textLength(body)} chars`
    )
  }
  // The homepage is what is-agentic scans; a flat h1+h2 outline reads as
  // "no structure" to it, so the third level is the actual requirement.
  const { body } = await get("/")
  const h = headingCounts(body)
  record("homepage heading depth (h1+h2+h3)", h.h1 === 1 && h.h2 > 0 && h.h3 > 0, JSON.stringify(h))
}

/* ------------------------------------------------------------- trust anchors */

async function checkTrustAnchors() {
  for (const path of ["/about", "/contact", "/privacy"]) {
    const { res, body } = await get(path)
    const len = textLength(body)
    record(`trust anchor ${path}`, res.status === 200 && len >= 500, `${res.status}, ${len} chars`)
  }
  const { body } = await get("/")
  record(
    'footer exposes rel="privacy-policy"',
    /rel="privacy-policy"/.test(body)
  )
}

/* ------------------------------------------------------------ JSON-LD + llms */

async function checkStructuredData() {
  const { body } = await get("/")
  const blocks = [...body.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )].map((m) => m[1])
  record("homepage has JSON-LD", blocks.length > 0, `${blocks.length} blocks`)

  let graph = []
  for (const raw of blocks) {
    try {
      const parsed = JSON.parse(raw)
      graph = graph.concat(parsed["@graph"] ?? [parsed])
    } catch {
      record("JSON-LD parses", false, raw.slice(0, 80))
      return
    }
  }
  record("JSON-LD parses", true)

  const orgs = graph.filter((n) => n["@type"] === "Organization")
  record("Organization nodes present", orgs.length > 0, `${orgs.length}`)
  record(
    "every Organization has contactPoint + address",
    orgs.length > 0 && orgs.every((o) => o.contactPoint && o.address),
    orgs.map((o) => `${o.name}:${!!o.contactPoint}/${!!o.address}`).join(" ")
  )
  // Brand detectors read the head of the graph; leading with a portfolio
  // company is what made the scanner think this site is called "Codebase".
  record(
    "first graph node names the site brand",
    graph[0]?.name === "Christer Hagen",
    `${graph[0]?.["@type"]} ${graph[0]?.name}`
  )
}

async function checkLlmsTxt() {
  const { res, body } = await get("/llms.txt")
  record("/llms.txt served", res.status === 200, `${res.status}`)
  record(
    "/llms.txt has when-to-use guidance",
    /when to use/i.test(body),
    `${body.length} chars`
  )
}

/* ------------------------------------------------------- agent entry points */

async function checkAgentSurfaces() {
  const md = (r) => (r.res.headers.get("content-type") || "").includes("text/markdown")

  const agents = await get("/agents.md")
  record(
    "/agents.md serves markdown",
    agents.res.status === 200 &&
      md(agents) &&
      /when to use/i.test(agents.body) &&
      /## Capabilities/.test(agents.body) &&
      /## Authentication/.test(agents.body),
    `${agents.res.status}`
  )

  // On the root the agent view is the brief, not the home page copy.
  const mode = await get("/?mode=agent")
  record(
    "?mode=agent on root serves the agent brief",
    mode.res.status === 200 &&
      md(mode) &&
      /## Capabilities/.test(mode.body) &&
      /## Authentication/.test(mode.body)
  )
  const modePage = await get("/about?mode=agent")
  record(
    "?mode=agent on a page serves that page",
    modePage.res.status === 200 && md(modePage) && /north of Norway/.test(modePage.body)
  )

  // Answer engines get markdown; search crawlers must keep getting HTML, or the
  // pages stop being the thing that ranks.
  for (const ua of ["ClaudeBot/1.0", "GPTBot/1.2", "PerplexityBot/1.0"]) {
    const r = await get("/", { "User-Agent": ua })
    record(`${ua} receives markdown`, r.res.status === 200 && md(r))
  }
  for (const ua of ["Googlebot/2.1", "Mozilla/5.0 (Macintosh)"]) {
    const r = await get("/", { "User-Agent": ua })
    record(
      `${ua} still receives HTML`,
      (r.res.headers.get("content-type") || "").includes("text/html")
    )
  }

  const full = await get("/llms-full.txt")
  record(
    "/llms-full.txt served",
    full.res.status === 200 && full.body.length > 10000,
    `${full.body.length} chars`
  )

  for (const path of ["/portfolio/llms.txt", "/writing/llms.txt"]) {
    const r = await get(path)
    record(`section index ${path}`, r.res.status === 200 && r.body.startsWith("#"))
  }

  const catalog = await get("/.well-known/ai-catalog.json")
  let parsed = null
  try {
    parsed = JSON.parse(catalog.body)
  } catch {}
  // Shape per the ai-catalog spec: specVersion + host + entries[], each entry
  // carrying a trustManifest. The first version of this file used the wrong
  // field names and scored zero while looking perfectly reasonable.
  record(
    "ARD catalog matches the ai-catalog envelope",
    catalog.res.status === 200 &&
      parsed?.specVersion === "1.0" &&
      Boolean(parsed?.host?.identifier) &&
      Array.isArray(parsed?.entries) &&
      parsed.entries.length > 0 &&
      parsed.entries.every(
        (e) => e.identifier?.startsWith("urn:air:christerhagen.com:") && e.displayName && e.type && e.url && e.trustManifest
      ),
    `${catalog.res.status}`
  )
  record(
    "ARD catalog entries resolve",
    await (async () => {
      const urls = [...(parsed?.entries ?? []), ...(parsed?.collections ?? [])]
      if (!urls.length) return false
      for (const r of urls) {
        const probe = await get(new URL(r.url).pathname)
        if (probe.res.status !== 200) return false
      }
      return true
    })()
  )

  const links = await get("/about")
  const header = links.res.headers.get("link") || ""
  record(
    "Link header advertises sitemap + markdown",
    header.includes('rel="sitemap"') && header.includes('type="text/markdown"'),
    header.slice(0, 80)
  )

  const robots = await get("/robots.txt")
  record(
    "robots.txt differentiates AI crawler tiers",
    /GPTBot/.test(robots.body) && /Disallow: \//.test(robots.body)
  )

  const llms = await get("/llms.txt")
  record(
    "/llms.txt uses markdown links",
    /\[[^\]]+\]\(https?:\/\//.test(llms.body)
  )
}

/* --------------------------------------------------------------------- main */

const suites = [
  checkMarkdownNegotiation,
  checkMarkdownSuffix,
  check404,
  checkStructure,
  checkTrustAnchors,
  checkStructuredData,
  checkLlmsTxt,
  checkAgentSurfaces,
]

for (const suite of suites) {
  try {
    await suite()
  } catch (err) {
    record(suite.name, false, String(err))
  }
}

const failed = results.filter((r) => !r.pass)
for (const r of results) {
  if (!r.pass) console.log(`FAIL  ${r.name}${r.detail ? ` — ${r.detail}` : ""}`)
}
console.log(
  `\n${results.length - failed.length}/${results.length} agent-readiness checks passed against ${BASE_URL}`
)
process.exit(failed.length === 0 ? 0 : 1)
