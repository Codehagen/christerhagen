# 003 — Off-site Entity Runbook (Knowledge Panel + correct AI attribution)

**Goal:** make christerhagen.com the machine-canonical source on Christer Hagen,
earn a Google Knowledge Panel, and stop search/AI from blending him with the
*other* Christer Hagen. The website is ~90% done for this; everything below
lives **off** the site (Wikidata, Wikimedia Commons, Google, the press, your
profiles). None of it requires a code change.

Generated 2026-06-30 from a 6-dimension best-practice research pass + adversarial review.

**Your Wikidata item:** `Q140373910`
**Your entity home:** https://www.christerhagen.com

> Order matters. Do Step 0 first (you can't fix attribution you haven't looked
> at), then Step 1 (the photo gates the panel), then 2 → 5.

---

## Canonical fact block — use this phrasing *everywhere*, byte-for-byte

Drift between surfaces delays the panel and lowers AI confidence. Pick one and
propagate to the site schema, Wikidata, LinkedIn, Crunchbase, X bio, GitHub.

- **Name:** Christer Hagen (full: Christer Mehus Hagen)
- **One-line descriptor:** Norwegian serial entrepreneur and angel investor based in Bodø. Founder of Codebase and Not Another VC; sold Docdir to Visma in 2026.
- **Unique entity cluster (always pair the name with these):** Bodø · Codebase · Docdir → Visma. This trio is what separates you from the namesake.
- **Born:** 27 February 1991, Fauske, Norway
- **Education:** Nord University
- **Award:** Top 4%, NM i AI 2026

---

## Step 0 — Baseline measurement (do FIRST, ~20 min)

You need a "before" snapshot to know whether conflation is already happening and
to measure progress. Save everything with today's date.

- [ ] Google (logged out / incognito) these, screenshot each:
  - `Christer Hagen`
  - `Christer Hagen Bodø`
  - `Christer Hagen Codebase`
  - `Christer Hagen Docdir`
  Note: does any panel/knowledge result already show? Does the BI / Extraction
  Technologies Norway / Start UiA namesake appear and get blended in?
- [ ] Ask each of ChatGPT, Claude, Perplexity, Gemini: **"Who is Christer Hagen?"**
  and **"Who is Christer Hagen, the founder from Bodø?"** Record what each says,
  what it *cites*, and whether it conflates the two people.
- [ ] On Wikidata, search "Christer Hagen". **Find the namesake's QID if one
  exists** — you need it for Step 2 (P1889 "different from"). Write it here: `Q________`
- [ ] Re-run this whole step monthly. It's your scoreboard.

---

## Step 1 — The Commons photo (P18) — the gating step, get the license right

A free-licensed headshot on Wikimedia Commons, set as **P18** on `Q140373910`,
is the most-cited Knowledge Panel trigger. The panel often will not instantiate
until P18 exists.

**The catch the research flagged:** a professional headshot is the *photographer's*
copyright, not yours. Uploading the existing site portrait as CC-BY-SA without a
release will get it speedy-deleted from Commons and can flag your account.

Choose a license path, best to worst:

- [ ] **A (cleanest):** use a photo where *you* hold copyright — a self-portrait,
  or one taken by a friend who agrees to release it. Upload as "own work."
- [ ] **B:** get the original photographer to release one specific image. They
  email consent to **permissions-commons@wikimedia.org** using the Wikimedia VRT
  consent template (search "Wikimedia VRT declaration of consent"). Upload after
  the ticket clears.
- [ ] **C (avoid):** uploading the current `/images/christer-hagen-portrait.jpg`
  if a photographer shot it. It will be removed.

Upload steps:
- [ ] Create/log in to a Wikimedia Commons account.
- [ ] Upload Wizard → select the correct source ("own work" only if true) →
  license **CC BY-SA 4.0** → filename like `Christer Hagen 2026.jpg` →
  description (who, what, when) → add categories (e.g. *Norwegian businesspeople*).
- [ ] Photo spec: face clearly visible, well-lit, neutral background, ~square,
  ≥1000px.
- [ ] On `Q140373910`, add statement **P18 (image)** → your Commons file.

---

## Step 2 — Defend AND complete Wikidata Q140373910

### 2a. Defend notability FIRST (or the whole foundation can be deleted)

`Q140373910` is a self-created item on a person with no Wikipedia sitelink. It
can be nominated for deletion under **WD:Notability** — and if it goes, P18,
every reference, and the disambiguation vanish at once. Defend it before you
decorate it:

- [ ] Make sure the item is backed by the **independent press** (Step 3 URLs).
  Serious independent sources are your notability defense if challenged.
- [ ] Do **not** add unsourced promotional statements. They invite deletion.

### 2b. Core statements — each with a P854 reference URL

Add/verify these. Put a reference (**P854 reference URL**) on every factual one;
use the press URLs from Step 3 as sources.

- [ ] **P31** instance of = `Q5` (human)
- [ ] **P21** sex or gender
- [ ] **P569** date of birth = `1991-02-27` — *only if a published source states
  it* (e.g. an outlet that gives his age). If none, use year precision or omit;
  unsourced DOB on a living person gets challenged.
- [ ] **P19** place of birth = Fauske
- [ ] **P27** country of citizenship = Norway (`Q20`)
- [ ] **P106** occupation = entrepreneur + software developer (+ investor)
- [ ] **P108** employer = Codebase / Not Another VC (create org items if needed,
  or skip until they exist)
- [ ] **P69** educated at = Nord University
- [ ] **P856** official website = `https://www.christerhagen.com`
- [ ] **P166** award received = NM i AI placement (only if a suitable award item exists)
- [ ] External-ID properties (these are strong, consistent corroboration):
  - [ ] **P2002** X/Twitter username = `CodeHagen`
  - [ ] **P2003** Instagram username = `christerhagen`
  - [ ] **P2037** GitHub username = `Codehagen`
  - [ ] **P6634** LinkedIn personal profile ID = `christerhagen`
  - [ ] Crunchbase person ID — in the "add statement" box type "Crunchbase
    person" and pick the property Wikidata suggests.

### 2c. Disambiguate from the namesake

- [ ] Set the item **description** (the short grey caption) to something
  distinctive, e.g. *"Norwegian entrepreneur and angel investor (born 1991)"* —
  visibly different from the BI/Extraction-Technologies namesake.
- [ ] Add **P1889 (different from)** → the namesake's QID from Step 0. This is
  the canonical mechanism that forces engines to keep the two people separate.
  (If the namesake has no item, skip P1889 but keep the distinct description.)

---

## Step 3 — Press backlinks + binding marquee claims to proof

Owned links (your site, llms.txt, notanother.vc) are discounted as self-asserted.
**Independent links are the real currency.** You already earned the press — now
make it point back and make it carry your headline claims.

Your real, in-codebase press URLs (`lib/content.ts`):
- Avisa Nordland — the Visma exit: `https://www.an.no/solgt-til-gigantselskap-det-storste-jeg-har-vart-med-pa/s/5-4-2368685`
- Bodø Nu — the AI sale: `https://www.bodonu.no/bodo-gr-nder-om-det-spektakulare-ai-salget-fra-sondagshobby-til-suksess/s/80-159-2583`
- Bodø Nu — NM i AI: `https://www.bodonu.no/briljerte-i-ai-mesterskap/s/5-159-249201`
- kode24 — work/side-projects: `https://www.kode24.no/artikkel/setter-av-3-timer-til-familien-du-har-alltid-tid-til-sideprosjekter/186039`

Actions:
- [ ] Email each outlet and ask them to **link your name to christerhagen.com**
  in the article. One do-follow link from `an.no` outweighs a dozen owned
  profiles. (Template below.)
- [ ] Bind each headline claim to its independent source so AI treats it as
  verified, not self-promotion: the **exit** → the an.no article; the **NM i AI
  Top 4%** → the bodonu "briljerte i AI-mesterskap" article. (This is the on-site
  `subjectOf`/`citation` schema work — see plan note below — but it belongs to
  this verifiability goal.)

**Outreach email (NO):**
> Hei [navn],
>
> Takk for en god sak om [tema] tidligere. Jeg har samlet en offisiell side med
> bekreftet info om meg på christerhagen.com. Hvis dere oppdaterer eller
> refererer saken, hadde det vært til stor hjelp om navnet mitt kunne lenke dit —
> det gjør det lettere for lesere (og Google) å finne riktig kilde.
>
> Mvh, Christer Hagen

**Outreach email (EN):** same, asking for the name to link to christerhagen.com.

---

## Step 4 — Make every profile link back (bidirectional sameAs)

Corroboration comes from **two-way** links, not from listing more profiles in
your schema. For each profile in your `sameAs`, set its website field to
christerhagen.com:

- [ ] LinkedIn → Contact info → Website = christerhagen.com
- [ ] X bio link = christerhagen.com
- [ ] GitHub (Codehagen) profile → website
- [ ] Instagram bio link
- [ ] Crunchbase person → website
- [ ] Confirm the Wikidata **P856** is set (Step 2b)

---

## Step 5 — Claim the panel, then maintain

- [ ] After Step 1 (P18) + Step 2 (referenced Wikidata) + at least one
  independent backlink land, **wait ~4–10 weeks**. Panels are not instant.
- [ ] Monitor by re-running Step 0 monthly.
- [ ] When a panel appears, **claim it via Google Search Console verified
  ownership** of christerhagen.com (the reliable route — the "claim this
  knowledge panel" flow needs a verified official representative).
- [ ] Sustain it by keeping facts consistent across all surfaces. Edit the
  *web*, not the panel UI.

---

## Critical path, in one line

**Properly-licensed P18 + a notability-defended, fully-referenced Wikidata item +
one real independent backlink + P1889/baseline disambiguation.** Everything else
(more owned profiles, monthly essays, schema gold-plating) is secondary.

## Companion on-site work (separate track, not in this runbook)

The schema edits that support the above live in `lib/seo.ts` / `lib/content.ts`:
wire `pressItems` into `subjectOf`/`citation`, add `disambiguatingDescription`,
reconcile the canonical `jobTitle`/`description` to include the angel role + the
Visma exit, add the AI lane to `knowsAbout`. Ask for the "on-site schema wins"
track when ready.
