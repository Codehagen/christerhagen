"use client"

import { fontMono, fontSerif } from "../../kit"

import { PostPage, type Ground } from "./post-page"

/**
 * The comparison: the same page and frame as 11, on christerhagen.com's
 * current register — warm paper, Newsreader, JetBrains Mono, rust. The values
 * are the site's own (app/globals.css :root), written out so the piece does
 * not depend on the site's tokens.
 */
const RUST = "oklch(0.52 0.12 44)"

const PAPER: Ground = {
  label: "christerhagen.com today",
  ground: "#f5f2ea",
  band: "#fbfaf5",
  bandEdge: "#e6e0d3",
  ink: "#211e18",
  body: "#36322a",
  grey: "#6a6453",
  railIdle: "#8a8373",
  railActive: "#26231c",
  accent: RUST,
  font: fontSerif,
  railFont: fontMono,
  railSize: "1.5cqw",
  railTracking: "0.02em",
  metaFont: fontMono,
  noteFont: fontSerif,
  noteSize: "2.05cqw",
  noteItalic: true,
  bodySize: "2.4cqw",
  bodyLeading: 1.6,
  bodyWeight: 400,
  titleSize: "3.6cqw",
  titleWeight: 600,
  titleTracking: "-0.015em",
}

export default function TodaysPaper() {
  return <PostPage g={PAPER} label="The Docdir post on the site's current paper" />
}
