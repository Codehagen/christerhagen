#!/usr/bin/env node
// Integration SEO check. Assumes a server is already running at BASE_URL.
// Usage: BASE_URL=http://localhost:3100 node scripts/seo-check.mjs

const BASE_URL = process.env.BASE_URL || "http://localhost:3100"
const CANONICAL_HOST = "https://www.christerhagen.com"

// path -> page-specific canonical/og path + expected document language.
const HTML_PAGES = [
  { path: "/", canonical: "/", lang: "en" },
  { path: "/about", canonical: "/about", lang: "en" },
  { path: "/portfolio", canonical: "/portfolio", lang: "en" },
  { path: "/portfolio/codebase", canonical: "/portfolio/codebase", lang: "en" },
  { path: "/writing", canonical: "/writing", lang: "en" },
  { path: "/writing/docdir-visma", canonical: "/writing/docdir-visma", lang: "en" },
  { path: "/process", canonical: "/process", lang: "en" },
  { path: "/contact", canonical: "/contact", lang: "en" },
  { path: "/brand", canonical: "/brand", lang: "en" },
  // Norwegian mirror
  { path: "/no", canonical: "/no", lang: "no" },
  { path: "/no/about", canonical: "/no/about", lang: "no" },
  { path: "/no/portfolio", canonical: "/no/portfolio", lang: "no" },
  { path: "/no/portfolio/codebase", canonical: "/no/portfolio/codebase", lang: "no" },
  { path: "/no/writing", canonical: "/no/writing", lang: "no" },
  { path: "/no/writing/docdir-visma", canonical: "/no/writing/docdir-visma", lang: "no" },
  { path: "/no/process", canonical: "/no/process", lang: "no" },
  { path: "/no/contact", canonical: "/no/contact", lang: "no" },
  { path: "/no/brand", canonical: "/no/brand", lang: "no" },
]

// Pages that must carry at least one JSON-LD block.
const JSONLD_PAGES = new Set([
  "/",
  "/about",
  "/portfolio/codebase",
  "/writing/docdir-visma",
  "/no",
  "/no/about",
  "/no/portfolio/codebase",
  "/no/writing/docdir-visma",
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

function getHreflangs(html) {
  // returns { values:Set, hrefs:string[] } from <link rel="alternate" hreflang=...>
  const tags = html.match(/<link[^>]*rel=["']alternate["'][^>]*>/gi) || []
  const values = new Set()
  const hrefs = []
  for (const tag of tags) {
    const v = tag.match(/hreflang=["']([^"']+)["']/i)
    const h = tag.match(/href=["']([^"']+)["']/i)
    if (v) values.add(v[1].toLowerCase())
    if (h) hrefs.push(h[1])
  }
  return { values, hrefs }
}

function hasLang(html, lang) {
  return new RegExp(`lang=["']${lang}["']`, "i").test(html)
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

  // hreflang: must offer en, nb-no, x-default, all on the www host
  const { values, hrefs } = getHreflangs(body)
  const hasAll =
    values.has("en") && values.has("nb-no") && values.has("x-default")
  record(
    `${label} hreflang en+nb-NO+x-default`,
    hasAll,
    hasAll ? "" : `got [${[...values].join(",")}]`
  )
  const allWww = hrefs.length > 0 && hrefs.every((h) => h.startsWith(CANONICAL_HOST))
  record(`${label} hreflang hrefs are www`, allWww)

  // document language: NO pages must declare lang="no"
  record(
    `${label} declares lang="${page.lang}"`,
    hasLang(body, page.lang),
    ""
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
