"use client"

import { G, Crop, HomePage, Name } from "./_home"

/**
 * 62 — The byline.
 *
 * The portrait cut down to the face in a circle the height of the two lines
 * beside it, the way an author's byline sits over a column: the name, the
 * role, and who is saying it. Colour untouched; at this size the dark room
 * around him is only a rim. The rest of the page is 61's.
 */

const PEN = "#C2410C"

export default function Byline() {
  return (
    <HomePage
      label="christerhagen.com, the home page with a byline photo"
      pen={PEN}
      top={(lang) => (
        <div className="flex items-center" style={{ gap: "1.7cqw" }}>
          <span
            className="relative block shrink-0 overflow-hidden rounded-full"
            style={{ width: "6.2cqw", height: "6.2cqw", background: "#2a2622", boxShadow: `0 0 0 1px ${G.hair}` }}
          >
            <Crop cx={0.585} cy={0.392} span={0.4} aspect={1} sizes="200px" alt="Christer Hagen" className="object-cover" />
          </span>
          <Name lang={lang} />
        </div>
      )}
    />
  )
}
