import { describe, expect, it } from "vitest"

import {
  defaultPresentationStyle,
  renderPresentationStyle,
} from "@/lib/presentation-style"

describe("presentation style renderer", () => {
  it("reproduces the same scene from the same config", () => {
    expect(renderPresentationStyle(defaultPresentationStyle)).toEqual(
      renderPresentationStyle(defaultPresentationStyle),
    )
  })

  it("changes the scene when the seed changes", () => {
    const first = renderPresentationStyle(defaultPresentationStyle)
    const second = renderPresentationStyle({
      ...defaultPresentationStyle,
      seed: defaultPresentationStyle.seed + 1,
    })

    expect(second).not.toEqual(first)
  })
})
