import type { Lang } from "@/lib/companies"

/**
 * The pen's notes on the site's own pages (DESIGN.md §3): Christer's voice,
 * lowercase, a few words, and only facts the site already states. Both
 * languages. Notes are aria-hidden where they are drawn.
 *
 * About, contact, process, privacy, brand and the 404 carry no notes: about
 * gets none in the column (67), and the rest have no mark to hang one on.
 */

/** Home (64, kept from 49): beside the newest post in the writing ledger. */
export const HOME_PEN: Record<Lang, { newest: string }> = {
  en: { newest: "the one about the sale" },
  no: { newest: "den om salget" },
}
