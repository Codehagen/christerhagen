"use client"

import { DesktopPost } from "./desktop"

/**
 * 41 — The post page.
 *
 * The canonical one: the Docdir post at desktop width with every kept part
 * in its place and nothing added. The header rings Writing in the pen's
 * blue; the rail follows the reading; the pen makes its three marks in
 * reading order (bracket, ring on PowerOffice, highlighter on the lesson);
 * the rail ends in 23's switch to take the pen away; read next turns the
 * page; the footer is the address.
 */

const PEN = "#2B5CD8"
const WASH = "color-mix(in oklch, #2B5CD8 17%, transparent)"

export default function ThePostPage() {
  return <DesktopPost label="The Docdir post, the finished page" slug="docdir-visma" lang="en" color={PEN} wash={WASH} />
}
