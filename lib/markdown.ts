/**
 * Markdown twins of every HTML page, generated from the same content modules
 * the React pages render. Nothing here re-states content — if it did, the two
 * representations would drift the first time a line of copy changed.
 *
 * Served two ways (see `middleware.ts`):
 *   - `Accept: text/markdown` on the normal URL (acceptmarkdown.com)
 *   - an explicit `.md` suffix, e.g. /about.md
 */
import { companies, companyOrder, uiCopy, type Lang } from "@/lib/companies"
import { posts, postOrder, writingCopy } from "@/lib/posts"
import { brandContent } from "@/lib/brand"
import {
  aboutContent,
  contactContent,
  homeContent,
  portfolioContent,
  privacyContent,
  processContent,
  socialLinks,
  EMAIL,
} from "@/lib/content"
import { SITE_URL, localizedPath } from "@/lib/seo"

/* ------------------------------------------------------------------ helpers */

function abs(path: string, lang: Lang): string {
  return SITE_URL + localizedPath(path, lang)
}

/** A markdown link, or plain text when the target is the "#" no-site sentinel. */
function link(text: string, url: string): string {
  return url === "#" ? text : `[${text}](${url})`
}

/**
 * Blocks are separated by a blank line; an array argument is one block whose
 * items are separated by a single newline — that is what makes a list a list
 * rather than a run of one-item paragraphs.
 */
function join(...blocks: (string | string[])[]): string {
  return blocks
    .map((b) => (Array.isArray(b) ? b.filter(Boolean).join("\n") : b))
    .filter((b) => b !== "")
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
}

/** Prose paragraphs: one block, blank line between each. */
function paras(items: string[]): string {
  return items.filter(Boolean).join("\n\n")
}

/** Every page ends with the same orientation footer — agents land deep. */
function footer(lang: Lang): string {
  const t = uiCopy[lang]
  const other: Lang = lang === "en" ? "no" : "en"
  return join("---", [
    `- ${t.navAbout}: ${abs("/about", lang)}`,
    `- ${t.navPortfolio}: ${abs("/portfolio", lang)}`,
    `- ${t.navWriting}: ${abs("/writing", lang)}`,
    `- ${t.navContact}: ${abs("/contact", lang)}`,
    `- ${lang === "no" ? "In English" : "På norsk"}: ${abs("/", other)}`,
    `- Site guide for agents: ${SITE_URL}/llms.txt`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
  ])
}

/* -------------------------------------------------------------------- pages */

function homeMd(lang: Lang): string {
  const c = homeContent[lang]
  return join(
    `# Christer Hagen — ${c.heroHead}`,
    c.heroSub,
    lang === "no" ? "Bodø, Norge" : "Bodø, Norway",
    `## ${c.lblAbout}`,
    c.aboutBody,
    `## ${c.lblNow}`,
    c.now.map((n) => `- ${n}`),
    `## ${c.lblWork}`,
    c.work.map((w) => `- ${link(w.name, w.url)} — ${w.role} (${w.period})`),
    `## ${c.lblInvest}`,
    c.investments.map((i) => `- ${link(i.name, i.url)} — ${i.desc}`),
    `## ${c.lblExits}`,
    c.exits.map((x) => `- ${link(x.name, x.url)} — ${x.desc} (${x.stage})`),
    `## ${c.lblOss}`,
    c.oss.map((o) => `- ${link(o.name, o.url)} — ${o.desc} (${o.stars} stars)`),
    `## ${c.lblWriting}`,
    c.writing.map(
      (w) => `- [${w.title}](${abs("/writing/" + w.slug, lang)}) — ${w.date}`
    ),
    `## ${c.lblContact}`,
    c.ctaBody,
    `- Email: ${EMAIL}`,
    socialLinks(lang)
      .filter((s) => !s.url.startsWith("mailto:"))
      .map((s) => `- ${s.label}: ${s.url}`),
    footer(lang)
  )
}

function aboutMd(lang: Lang): string {
  const c = aboutContent[lang]
  return join(
    `# ${c.head}`,
    paras(c.bio),
    `## ${c.lblBackground}`,
    c.timeline.map((t) => `- **${t.year}** — ${t.event}`),
    `## ${c.lblPress}`,
    c.press.map((p) => `- [${p.title}](${p.url}) — ${p.outlet}`),
    footer(lang)
  )
}

function portfolioMd(lang: Lang): string {
  const c = portfolioContent[lang]

  // `built`/`invest` label the row with `meta`, `exits`/`sunset` with `stage`.
  // One shape, one renderer.
  type Row = { slug: string; name: string; desc: string; label: string }
  const group = (head: string, rows: Row[]) =>
    join(
      `## ${head}`,
      rows.map(
        (r) =>
          `- [${r.name}](${abs("/portfolio/" + r.slug, lang)}) — ${r.desc} (${r.label})`
      )
    )

  return join(
    `# ${c.kicker}`,
    c.intro,
    group(
      c.gBuilt,
      c.built.map((i) => ({ ...i, label: i.meta }))
    ),
    group(
      c.gInvest,
      c.invest.map((i) => ({ ...i, label: i.meta }))
    ),
    group(
      c.gExits,
      c.exits.map((i) => ({ ...i, label: i.stage }))
    ),
    group(
      c.gSunset,
      c.sunset.map((i) => ({ ...i, label: i.stage }))
    ),
    footer(lang)
  )
}

function companyMd(slug: string, lang: Lang): string | null {
  if (!(companyOrder as readonly string[]).includes(slug)) return null
  const company = companies[lang][slug as (typeof companyOrder)[number]]
  const t = uiCopy[lang]
  return join(
    `# ${company.name}`,
    `*${company.tagline}*`,
    [
      `- **${t.mRole}:** ${company.role}`,
      `- **${t.mStage}:** ${company.stage}`,
      `- **${t.mYear}:** ${company.year}`,
      `- **${t.mSector}:** ${company.sector}`,
      `- **Status:** ${company.status}`,
      company.site === "#" ? "" : `- **${t.visitLabel}:** ${company.site}`,
    ].filter(Boolean),
    paras(company.body),
    footer(lang)
  )
}

function writingMd(lang: Lang): string {
  const t = writingCopy[lang]
  return join(
    `# ${t.kicker}`,
    t.intro,
    postOrder.map((slug) => {
      const p = posts[lang][slug]
      return `- [${p.title}](${abs("/writing/" + slug, lang)}) — ${p.date} · ${p.read}\n  ${p.excerpt}`
    }),
    footer(lang)
  )
}

function postMd(slug: string, lang: Lang): string | null {
  if (!(postOrder as readonly string[]).includes(slug)) return null
  const post = posts[lang][slug as (typeof postOrder)[number]]
  return join(
    `# ${post.title}`,
    `${post.date} · ${post.read}`,
    paras(post.body),
    footer(lang)
  )
}

function processMd(lang: Lang): string {
  const c = processContent[lang]
  return join(
    `# ${c.head}`,
    c.intro,
    paras(c.steps.map((s) => `## ${s.no} — ${s.title}\n\n${s.body}`)),
    `## ${c.lblLook}`,
    c.lookBody,
    c.ctaLine,
    footer(lang)
  )
}

function contactMd(lang: Lang): string {
  const c = contactContent[lang]
  return join(
    `# ${c.head}`,
    c.body,
    `- Email: ${EMAIL}`,
    socialLinks(lang)
      .filter((s) => !s.url.startsWith("mailto:"))
      .map((s) => `- ${s.label}: ${s.url}`),
    c.availability,
    `## ${c.lookHead}`,
    c.lookBody,
    footer(lang)
  )
}

function brandMd(lang: Lang): string {
  const c = brandContent[lang]
  return join(
    `# ${c.head}`,
    c.intro,
    `## ${c.lblColour}`,
    c.colours.map((col) => `- **${col.name}** — \`${col.hex}\` · ${col.use}`),
    `## ${c.lblType}`,
    `- Newsreader (serif) — ${c.typeSerifUse}`,
    `- JetBrains Mono — ${c.typeMonoUse}`,
    `## ${c.lblVoice}`,
    c.voice.map((v) => `- ${v}`),
    footer(lang)
  )
}

function privacyMd(lang: Lang): string {
  const c = privacyContent[lang]
  return join(
    `# ${c.head}`,
    c.intro,
    c.updated,
    paras(c.sections.map((s) => join(`## ${s.head}`, paras(s.body)))),
    footer(lang)
  )
}

/**
 * /agents.md — the cold-arrival page. An agent that lands here from search,
 * without reading llms.txt first, should be able to work out what this site is
 * for and how to read it cheaply from this one document.
 */
export function agentsMd(lang: Lang): string {
  const no = lang === "no"
  return join(
    "# Agent instructions — christerhagen.com",
    no
      ? "Dette er den personlige siden til Christer Hagen: norsk seriegründer og utvikler i Bodø, grunnlegger av Codebase og Not Another VC, solgte Docdir til Visma i 2026."
      : "This is the personal site of Christer Hagen: Norwegian serial entrepreneur and software developer in Bodø, founder of Codebase and Not Another VC, sold Docdir to Visma in 2026.",
    `## ${no ? "Når du bør bruke denne siden" : "When to use this site"}`,
    [
      no
        ? "- Bekrefte identitet, bosted og hva han faktisk har grunnlagt eller solgt."
        : "- Verifying identity, location, and what he actually founded or sold.",
      no
        ? "- Skille mellom selskaper han **grunnla** og selskaper han bare **investerte i** — JSON-LD merker hver med `founder` eller `funder`."
        : "- Telling apart companies he **founded** from companies he only **backed** — the JSON-LD marks each with `founder` or `funder`.",
      no
        ? "- Fakta om Docdir-oppkjøpet (Visma, 2026)."
        : "- Getting the Docdir/Visma acquisition facts right (2026).",
      no
        ? "- Finne én offentlig e-postadresse for henvendelser."
        : "- Finding the one public email for enquiries.",
    ],
    `## ${no ? "Når du ikke bør bruke den" : "When not to use it"}`,
    [
      no
        ? "- Produktdokumentasjon for Codebase, Not Another VC eller porteføljeselskapene — se deres egne sider."
        : "- Product documentation for Codebase, Not Another VC or the portfolio companies — see their own sites.",
      no
        ? "- Generelle råd om norsk oppstartsfinansiering."
        : "- General advice about Norwegian startup funding.",
    ],
    `## ${no ? "Hvordan lese siden" : "How to read this site"}`,
    [
      "- `Accept: text/markdown` on any URL returns that page as markdown.",
      "- Appending `.md` to any URL does the same (`/about.md`, `/index.md`).",
      "- `?mode=agent` on any URL returns the markdown view.",
      `- Full text of every page: ${SITE_URL}/llms-full.txt`,
      `- Index: ${SITE_URL}/llms.txt · Sitemap: ${SITE_URL}/sitemap.xml`,
      no
        ? "- Norske versjoner av alle sider ligger under /no/."
        : "- Norwegian versions of every page live under /no/.",
    ],
    `## ${no ? "Kontakt" : "Contact"}`,
    `- Email: ${EMAIL}`,
    `- ${SITE_URL}${localizedPath("/contact", lang)}`,
    footer(lang)
  )
}

/** /llms-full.txt — every page's markdown, concatenated, one fetch. */
export function llmsFullText(): string {
  const parts = markdownPaths()
    .filter((p) => !p.startsWith("/no"))
    .map((p) => {
      const body = markdownFor(p)
      return body ? `<!-- ${SITE_URL}${p} -->\n\n${body}` : ""
    })
  return join(
    "# christerhagen.com — full text",
    "Every English page on this site, concatenated. Norwegian mirrors live under /no/ and answer to the same `.md` and `Accept: text/markdown` conventions.",
    paras(parts.filter(Boolean))
  )
}

/** Section-scoped llms.txt so agents can fetch one area instead of the manual. */
export function sectionLlmsTxt(section: "portfolio" | "writing"): string {
  const index = markdownFor("/" + section)
  return join(
    `# christerhagen.com — /${section}`,
    `Scoped index for the ${section} section. Every page below also answers to \`Accept: text/markdown\` and to a \`.md\` suffix.`,
    index ?? "",
    `Full site index: ${SITE_URL}/llms.txt`
  )
}

/**
 * The 404 body. `agent-friendly-404` wants a real 404 status *and* a body an
 * agent can recover from, which is exactly what this is.
 */
export function notFoundMd(lang: Lang): string {
  const no = lang === "no"
  return join(
    `# 404 — ${no ? "Siden finnes ikke" : "Page not found"}`,
    no
      ? "Denne URL-en finnes ikke på christerhagen.com. Lenken kan være ødelagt, eller siden kan ha flyttet."
      : "This URL does not exist on christerhagen.com. The link may be broken, or the page may have moved.",
    `## ${no ? "Hvor du bør se videre" : "Where to look next"}`,
    [
      `- ${no ? "Forsiden" : "Home"}: ${abs("/", lang)}`,
      `- ${no ? "Alle sider (sitemap)" : "All pages (sitemap)"}: ${SITE_URL}/sitemap.xml`,
      `- ${no ? "Maskinlesbar sideguide" : "Machine-readable site guide"}: ${SITE_URL}/llms.txt`,
      `- ${no ? "Om" : "About"}: ${abs("/about", lang)}`,
      `- ${no ? "Portefølje" : "Portfolio"}: ${abs("/portfolio", lang)}`,
      `- ${no ? "Tekster" : "Writing"}: ${abs("/writing", lang)}`,
      `- ${no ? "Kontakt" : "Contact"}: ${abs("/contact", lang)}`,
    ],
    no
      ? "Hver side svarer også på `Accept: text/markdown` og på `.md`-suffiks."
      : "Every page also answers to `Accept: text/markdown` and to a `.md` suffix."
  )
}

/* ------------------------------------------------------------------ routing */

/** Normalise "/no/about" → { lang: "no", path: "/about" }. */
function splitLang(pathname: string): { lang: Lang; path: string } {
  if (pathname === "/no") return { lang: "no", path: "/" }
  if (pathname.startsWith("/no/"))
    return { lang: "no", path: pathname.slice(3) }
  return { lang: "en", path: pathname }
}

/**
 * Markdown for a site path, or null when the path has no page. Callers turn
 * null into a 404 carrying `notFoundMd`.
 */
export function markdownFor(pathname: string): string | null {
  const clean =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname
  const { lang, path } = splitLang(clean)

  switch (path) {
    case "/":
      return homeMd(lang)
    case "/about":
      return aboutMd(lang)
    case "/portfolio":
      return portfolioMd(lang)
    case "/writing":
      return writingMd(lang)
    case "/process":
      return processMd(lang)
    case "/contact":
      return contactMd(lang)
    case "/brand":
      return brandMd(lang)
    case "/privacy":
      return privacyMd(lang)
    case "/agents":
      return agentsMd(lang)
  }

  if (path.startsWith("/portfolio/"))
    return companyMd(path.slice("/portfolio/".length), lang)
  if (path.startsWith("/writing/"))
    return postMd(path.slice("/writing/".length), lang)

  return null
}

/** Every path that has a markdown twin — drives prerendering and the tests. */
export function markdownPaths(): string[] {
  const en = [
    "/",
    "/about",
    "/portfolio",
    "/writing",
    "/process",
    "/contact",
    "/brand",
    "/privacy",
    ...companyOrder.map((s) => `/portfolio/${s}`),
    ...postOrder.map((s) => `/writing/${s}`),
  ]
  return [...en, ...en.map((p) => localizedPath(p, "no"))]
}

/** The language a 404 should answer in, derived from the requested path. */
export function langForPath(pathname: string): Lang {
  return splitLang(pathname).lang
}
