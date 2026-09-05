import { describe, expect, it } from "vitest"

import {
  canDeleteSection,
  createAboutSection,
  createHeroSection,
  createOpenRolesSection,
  duplicateSection,
  isSectionVisible,
  reorderSections,
} from "@/features/pages/lib/page-config"

describe("page-config section helpers", () => {
  it("prevents deleting hero and open roles", () => {
    expect(canDeleteSection(createHeroSection())).toBe(false)
    expect(canDeleteSection(createOpenRolesSection())).toBe(false)
    expect(canDeleteSection(createAboutSection())).toBe(true)
  })

  it("duplicates with a fresh id", () => {
    const source = createAboutSection({ title: "Culture" })
    const copy = duplicateSection(source)
    expect(copy.id).not.toBe(source.id)
    expect(copy.type).toBe("about")
    if (copy.type === "about" && source.type === "about") {
      expect(copy.title).toBe("Culture")
      expect(copy.body).toBe(source.body)
    }
  })

  it("reorders sections by id", () => {
    const a = createHeroSection({ title: "A" })
    const b = createAboutSection({ title: "B" })
    const c = createOpenRolesSection({ title: "C" })
    const next = reorderSections([a, b, c], a.id, c.id)
    expect(next.map((section) => section.id)).toEqual([b.id, c.id, a.id])
  })

  it("treats missing hidden as visible", () => {
    const section = createAboutSection()
    expect(isSectionVisible(section)).toBe(true)
    expect(isSectionVisible({ ...section, hidden: true })).toBe(false)
  })
})
