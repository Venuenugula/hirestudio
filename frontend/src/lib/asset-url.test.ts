import { describe, expect, it, vi } from "vitest"

describe("resolveAssetUrl", () => {
  it("returns null for empty values", async () => {
    vi.resetModules()
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com")
    const { resolveAssetUrl } = await import("./asset-url")
    expect(resolveAssetUrl(null)).toBeNull()
    expect(resolveAssetUrl("")).toBeNull()
    expect(resolveAssetUrl("   ")).toBeNull()
  })

  it("prefixes relative upload paths with the API base URL", async () => {
    vi.resetModules()
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com/")
    const { resolveAssetUrl } = await import("./asset-url")
    expect(resolveAssetUrl("/uploads/logo.png")).toBe(
      "https://api.example.com/uploads/logo.png",
    )
  })

  it("leaves absolute and blob URLs unchanged", async () => {
    vi.resetModules()
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com")
    const { resolveAssetUrl } = await import("./asset-url")
    expect(resolveAssetUrl("https://cdn.example.com/a.png")).toBe(
      "https://cdn.example.com/a.png",
    )
    expect(resolveAssetUrl("blob:http://localhost/1")).toBe(
      "blob:http://localhost/1",
    )
  })

  it("returns relative paths when no API base is set", async () => {
    vi.resetModules()
    vi.stubEnv("VITE_API_BASE_URL", "")
    const { resolveAssetUrl } = await import("./asset-url")
    expect(resolveAssetUrl("/uploads/logo.png")).toBe("/uploads/logo.png")
  })
})
