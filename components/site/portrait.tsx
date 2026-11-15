import Image from "next/image"

import type { Lang } from "@/lib/companies"
import { cn } from "@/lib/utils"

import { CopyAddress } from "./copy-address"

const SRC = "/images/christer-hagen-portrait.jpg"
/** The file is 600 × 900: height over width. */
const TALL = 1.5

/**
 * A crop of the portrait without a new file: the image is drawn larger than
 * its box and moved so (cx, cy) sits in the middle. `span` is how much of the
 * photo's width the box shows; `aspect` is the box's width over its height.
 */
function Crop({
  cx,
  cy,
  span,
  aspect,
  sizes,
  alt,
  className,
  priority,
}: {
  cx: number
  cy: number
  span: number
  aspect: number
  sizes: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const w = 100 / span
  const h = w * TALL * aspect
  return (
    <span
      className="absolute block"
      style={{
        width: `${w}%`,
        height: `${h}%`,
        left: `${50 - cx * w}%`,
        top: `${50 - cy * h}%`,
      }}
    >
      <Image
        src={SRC}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    </span>
  )
}

const ALT: Record<Lang, string> = {
  en: "Christer Hagen",
  no: "Christer Hagen",
}

/**
 * `toned` (home, 64): the portrait greyed and lifted toward the ground and
 * faded out at the bottom, in the right margin beside the name: ≈55px off
 * the column, 180px wide, 4:5. Place it inside a `relative` block at the top
 * of the column; it positions itself at `left: calc(100% + 55px)` and is
 * hidden where there is no margin.
 */
export function TonedPortrait({
  lang,
  className,
}: {
  lang: Lang
  className?: string
}) {
  return (
    <span
      className={cn(
        "absolute top-[9px] left-[calc(100%+55px)] hidden aspect-[4/5] w-[180px] overflow-hidden margin:block",
        className
      )}
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 58%, transparent 97%)",
        maskImage: "linear-gradient(to bottom, #000 58%, transparent 97%)",
      }}
    >
      <Crop
        cx={0.58}
        cy={0.43}
        span={0.56}
        aspect={0.8}
        sizes="360px"
        alt={ALT[lang]}
        priority
        className="[filter:grayscale(1)_contrast(0.52)_brightness(1.38)]"
      />
    </span>
  )
}

const SIGN_ALT: Record<Lang, string> = {
  en: "Christer Hagen, smiling",
  no: "Christer Hagen, smilende",
}

/**
 * `signature` (about, 67): replaces the footer as a sign-off. A 48px face
 * (radius 5px, hairline ring), 14px to the name and the availability line,
 * then the address with its copy 17px below. In full colour.
 */
export function SignaturePortrait({
  lang,
  availability,
  className,
}: {
  lang: Lang
  /** `contactContent[lang].availability`. */
  availability: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-[14px]">
        <div
          className="relative size-12 shrink-0 overflow-hidden rounded-[5px] bg-[#2a2522]"
          style={{ boxShadow: "0 0 0 1px var(--hairline)" }}
        >
          <Image
            src={SRC}
            alt={SIGN_ALT[lang]}
            fill
            sizes="96px"
            className="object-cover"
            style={{
              objectPosition: "center 40%",
              transform: "scale(2.1)",
              transformOrigin: "59% 38%",
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-[560] tracking-[-0.01em]">Christer Hagen</p>
          <p className="text-small text-ink-muted">{availability}</p>
        </div>
      </div>
      <CopyAddress lang={lang} size="body" className="mt-[17px]" />
    </div>
  )
}

/**
 * Both portraits behind one name:
 *   <Portrait variant="toned" lang={lang} />
 *   <Portrait variant="signature" lang={lang} availability={…} />
 */
export function Portrait(
  props:
    | { variant: "toned"; lang: Lang; className?: string }
    | {
        variant: "signature"
        lang: Lang
        availability: React.ReactNode
        className?: string
      }
) {
  if (props.variant === "toned")
    return <TonedPortrait lang={props.lang} className={props.className} />
  return (
    <SignaturePortrait
      lang={props.lang}
      availability={props.availability}
      className={props.className}
    />
  )
}
