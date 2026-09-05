import { describe, expect, it } from "vitest"

import { parseJobDescriptionSections } from "@/features/public/lib/job-description"

describe("parseJobDescriptionSections", () => {
  it("returns a single About section when no headings exist", () => {
    const sections = parseJobDescriptionSections("Build APIs with Python.")
    expect(sections).toHaveLength(1)
    expect(sections[0]?.title).toBe("About the role")
  })

  it("splits markdown-style headings", () => {
    const sections = parseJobDescriptionSections(`## Responsibilities
Ship features

## Requirements
Python experience
`)
    expect(sections.map((section) => section.title)).toEqual([
      "Responsibilities",
      "Requirements",
    ])
  })
})
