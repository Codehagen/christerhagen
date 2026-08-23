// Shared type tokens. Single source of truth for the eyebrow / section-label
// treatment (font-mono uppercase micro-label) that was duplicated as a local
// `const label` across every page component.
export const eyebrow =
  "font-mono text-[0.75rem] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase"

/**
 * Stable anchor id for a heading, so every section of a page is deep-linkable
 * and an agent can cite a specific part of it rather than the whole document.
 */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
