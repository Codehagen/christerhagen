import type { CompanySlug, Lang } from "@/lib/companies"

/** The four facts a company page sets as its ledger (53). */
export type FactKey = "role" | "stage" | "year" | "sector"

/**
 * The pen's notes for the portfolio and company pages (DESIGN.md §3), from
 * the lab's round-3/k/_page.tsx `PEN`. For each company: the one fact the
 * ring belongs on, and what the pen says beside it. Lowercase, dry, and cut
 * down from what lib/companies.ts and lib/posts.ts already state. Never a
 * new fact.
 */
export const companyPen: Record<
  CompanySlug,
  { fact: FactKey } & Record<Lang, string>
> = {
  codebase: {
    fact: "stage",
    en: "the studio everything runs through",
    no: "studioet alt går gjennom",
  },
  bedrifty: {
    fact: "stage",
    en: "sailsdock's problem, rebuilt around ai",
    no: "sailsdocks problem, bygget på nytt rundt ai",
  },
  sailsdock: {
    fact: "stage",
    en: "wound down. the ideas went to bedrifty",
    no: "avviklet. ideene gikk til bedrifty",
  },
  "advanti-estate": {
    fact: "role",
    en: "software for an analogue trade",
    no: "programvare til en analog bransje",
  },
  refenze: {
    fact: "year",
    en: "the first one. cash, inventory, shipping",
    no: "det første. kapital, lager, frakt",
  },
  codenord: {
    fact: "stage",
    en: "pre-seed, through not another vc",
    no: "pre-seed, gjennom not another vc",
  },
  propdock: {
    fact: "year",
    en: "an early not another vc bet",
    no: "en tidlig not another vc-investering",
  },
  vendo: {
    fact: "stage",
    en: "pre-seed. days of back-and-forth, gone",
    no: "pre-seed. dager med fram og tilbake, borte",
  },
  fotovibe: {
    fact: "stage",
    en: "pre-seed. content at listing speed",
    no: "pre-seed. innhold i annonsens tempo",
  },
  somevibe: {
    fact: "stage",
    en: "pre-seed. reach as a system, not luck",
    no: "pre-seed. rekkevidde som system, ikke flaks",
  },
  docdir: {
    fact: "stage",
    en: "by visma, 2026. bodø's second, after poweroffice",
    no: "kjøpt av visma, 2026. bodøs andre, etter poweroffice",
  },
  utleieoversikten: {
    fact: "stage",
    en: "an exit. the early investment came back",
    no: "en exit. den tidlige investeringen kom tilbake",
  },
}
