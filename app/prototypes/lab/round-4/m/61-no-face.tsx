"use client"

import { HomePage, Name } from "./_home"

/**
 * 61 — No face.
 *
 * benji.org has no photo, so neither does this: the name and the role at
 * body size, one paragraph whose companies are 07's colourless links, the
 * writing as 32's ledger with the newest under a blue wash, then the work.
 * The page has to stand on the words alone; the only colour on it is the pen.
 */

const PEN = "#2B5CD8"

export default function NoFace() {
  return <HomePage label="christerhagen.com, the home page with no photo" pen={PEN} top={(lang) => <Name lang={lang} />} />
}
