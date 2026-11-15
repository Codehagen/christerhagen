"use client"

import { Crop, HomePage, Name } from "./_home"

/**
 * 64 — Toned to the ground.
 *
 * The same portrait, but grey and lifted: no colour, the contrast taken down
 * and the light brought up until the shirt is nearly #FDFDFC and the dark
 * room is a soft grey, then faded out at the bottom so it has no lower edge. It
 * sits in the right margin beside the name, where the pen writes further
 * down, at about a third of the width of the site's current hero: there,
 * but no longer the darkest thing on the page.
 */

const PEN = "#BE123C"

const css = `
.m64-photo { filter: grayscale(1) contrast(0.52) brightness(1.38); }
.m64-frame {
  -webkit-mask-image: linear-gradient(to bottom, #000 58%, transparent 97%);
  mask-image: linear-gradient(to bottom, #000 58%, transparent 97%);
}
`

export default function Toned() {
  return (
    <HomePage
      label="christerhagen.com, the home page with the photo toned to the ground"
      pen={PEN}
      css={css}
      top={(lang) => (
        <>
          <Name lang={lang} />
          <span
            className="m64-frame absolute block overflow-hidden"
            style={{ left: "calc(100% + 4.6cqw)", top: "1.4cqw", width: "15cqw", aspectRatio: "4 / 5" }}
          >
            <Crop
              cx={0.58}
              cy={0.43}
              span={0.56}
              aspect={0.8}
              sizes="360px"
              alt="Christer Hagen"
              className="m64-photo object-cover"
            />
          </span>
        </>
      )}
    />
  )
}
