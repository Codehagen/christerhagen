#!/usr/bin/env node
// Integration SEO check. Assumes a server is already running at BASE_URL.
// Usage: BASE_URL=http://localhost:3100 node scripts/seo-check.mjs

const BASE_URL = process.env.BASE_URL || "http://localhost:3100"
const CANONICAL_HOST = "https://www.christerhagen.com"

// path -> page-specific canonical/og path expected on that page
const HTML_PAGES = [
  { path: "/", canonical: "/" },
  { path: "/about", canonical: "/about" },
  { path: "/portfolio", canonical: "/portfolio" },
  { path: "/portfolio/codebase", canonical: "/portfolio/codebase" },
  { path: "/writing", canonical: "/writing" },
  { path: "/writing/docdir-visma", canonical: "/writing/docdir-visma" },
  { path: "/process", canonical: "/process" },
  { path: "/contact", canonical: "/contact" },
  { path: "/brand", canonical: "/brand" },
]

// Pages that must carry at least one JSON-LD block.
const JSONLD_PAGES = new Set([
  "/",
  "/about",
  "/portfolio/codebase",
  "/writing/docdir-visma",
])

const results = []
function record(name, pass, detail = "") {
  results.push({ name, pass, detail })
}

async function fetchText(path) {
  const url = BASE_URL + path
  const res = await fetch(url)
  const body = await res.text()
  return { res, body }
}

function expectedCanonical(canonicalPath) {
  // SITE_URL + path, with "/" mapping to the bare host (Next emits host for "/").
  return canonicalPath === "/"
    ? CANONICAL_HOST
    : CANONICAL_HOST + canonicalPath
}

function getCanonicalHref(html) {
  const m = html.match(
    /<link[^>]*rel=["']canonical["'][^>]*>/i
  )
  if (!m) return null
  const href = m[0].match(/href=["']([^"']+)["']/i)
  return href ? href[1] : null
}

function getOgUrl(html) {
  // property="og:url" content="..."  (order-independent)
  const tags = html.match(/<meta[^>]*>/gi) || []
  for (const tag of tags) {
    if (/property=["']og:url["']/i.test(tag)) {
      const c = tag.match(/content=["']([^"']+)["']/i)
      if (c) return c[1]
    }
  }
  return null
}

function countH1(html) {
  const m = html.match(/<h1[\s>]/gi)
  return m ? m.length : 0
}

function countJsonLd(html) {
  const m = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi
  )
  return m ? m.length : 0
}

function pathsEqual(a, b) {
  // Compare ignoring a single trailing slash difference.
  const norm = (s) => (s.length > 1 && s.endsWith("/") ? s.slice(0, -1) : s)
  return norm(a) === norm(b)
}

async function checkHtmlPage(page) {
  const label = page.path
  let body
  try {
    const r = await fetchText(page.path)
    if (r.res.status !== 200) {
      record(`${label} status 200`, false, `got ${r.res.status}`)
      return
    }
    record(`${label} status 200`, true)
    body = r.body
  } catch (err) {
    record(`${label} fetch`, false, String(err))
    return
  }

  // canonical
  const canonical = getCanonicalHref(body)
  if (!canonical) {
    record(`${label} canonical present`, false, "no <link rel=canonical>")
  } else {
    record(`${label} canonical present`, true)
    const startsWww = canonical.startsWith(CANONICAL_HOST)
    record(
      `${label} canonical is www host`,
      startsWww,
      startsWww ? "" : `got ${canonical}`
    )
    const expected = expectedCanonical(page.canonical)
    const ok = pathsEqual(canonical, expected)
    record(
      `${label} canonical path matches`,
      ok,
      ok ? "" : `got ${canonical}, expected ${expected}`
    )
  }

  // og:url
  const og = getOgUrl(body)
  if (!og) {
    record(`${label} og:url present`, false, "no og:url meta")
  } else {
    record(`${label} og:url present`, true)
    const startsWww = og.startsWith(CANONICAL_HOST)
    record(
      `${label} og:url is www host`,
      startsWww,
      startsWww ? "" : `got ${og}`
    )
    const expected = expectedCanonical(page.canonical)
    const ok = pathsEqual(og, expected)
    record(
      `${label} og:url path matches`,
      ok,
      ok ? "" : `got ${og}, expected ${expected}`
    )
  }

  // exactly one h1
  const h1s = countH1(body)
  record(
    `${label} exactly one <h1>`,
    h1s === 1,
    h1s === 1 ? "" : `found ${h1s}`
  )

  // json-ld where required
  if (JSONLD_PAGES.has(page.path)) {
    const n = countJsonLd(body)
    record(
      `${label} has JSON-LD`,
      n >= 1,
      n >= 1 ? "" : "no application/ld+json block"
    )
  }
}

async function checkPlainResource(path, mustContainWww) {
  try {
    const r = await fetchText(path)
    record(`${path} status 200`, r.res.status === 200, `got ${r.res.status}`)
    if (mustContainWww) {
      const hasWww = r.body.includes(CANONICAL_HOST)
      record(`${path} contains www host`, hasWww)
      // ensure no bare apex (apex not preceded by www.)
      const bareApex = /https:\/\/christerhagen\.com/.test(r.body)
      record(
        `${path} has no bare apex`,
        !bareApex,
        bareApex ? "found https://christerhagen.com" : ""
      )
    }
  } catch (err) {
    record(`${path} fetch`, false, String(err))
  }
}

async function main() {
  for (const page of HTML_PAGES) {
    await checkHtmlPage(page)
  }

  // llms.txt -> just expect 200
  await checkPlainResource("/llms.txt", false)

  // robots.txt and sitemap.xml -> must contain www, not bare apex
  await checkPlainResource("/robots.txt", true)
  await checkPlainResource("/sitemap.xml", true)

  // print table
  const nameWidth = Math.max(...results.map((r) => r.name.length), 4)
  let failed = 0
  console.log(`\nSEO check against ${BASE_URL}\n`)
  console.log(
    `${"STATUS".padEnd(6)}  ${"CHECK".padEnd(nameWidth)}  DETAIL`
  )
  console.log("-".repeat(6 + 2 + nameWidth + 2 + 6))
  for (const r of results) {
    const status = r.pass ? "PASS" : "FAIL"
    if (!r.pass) failed++
    console.log(
      `${status.padEnd(6)}  ${r.name.padEnd(nameWidth)}  ${r.detail}`
    )
  }
  console.log(
    `\n${results.length - failed}/${results.length} passed, ${failed} failed.\n`
  )

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
