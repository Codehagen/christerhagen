import { homeContent } from "@/lib/content"
import { ogCard, OG_SIZE } from "@/lib/og-card"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Christer Hagen"

// The site card: the name as the title, the about role as the grey line, and
// home's rose pen looped round the place (DESIGN.md §3: a ring holds a fact).
export default async function OpengraphImage() {
  const [role, place] = homeContent.en.aboutRole.split(" · ")
  return ogCard({
    eyebrow: "christerhagen.com",
    title: "Christer Hagen",
    titleSize: 104,
    meta: { text: `${role} ·`, ringed: place },
    pen: "rose",
  })
}
