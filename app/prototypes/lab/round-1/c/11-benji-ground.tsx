"use client"

import { fontHand, fontInter } from "../../kit"

import { PostPage, type Ground } from "./post-page"

/** One accent: the blue of a pen in the margin. */
const PEN_BLUE = "#2B5CD8"

const BENJI: Ground = {
  label: "benji.org",
  ground: "#FDFDFC",
  band: "#FFFFFF",
  bandEdge: "rgba(18,18,18,0.035)",
  ink: "#111111",
  body: "#111111",
  grey: "rgba(18,18,18,0.46)",
  railIdle: "rgba(18,18,18,0.4)",
  railActive: "#111111",
  accent: PEN_BLUE,
  font: fontInter,
  railFont: fontInter,
  railSize: "1.95cqw",
  railTracking: "-0.006em",
  metaFont: fontInter,
  noteFont: fontHand,
  noteSize: "2.5cqw",
  bodySize: "2.15cqw",
  bodyLeading: 1.43,
  bodyWeight: 460,
  titleSize: "3.1cqw",
  titleWeight: 560,
  titleTracking: "-0.012em",
}

export default function BenjiGround() {
  return <PostPage g={BENJI} label="The Docdir post on the benji.org ground" />
}
