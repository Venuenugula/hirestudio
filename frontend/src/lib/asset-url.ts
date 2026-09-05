/**
 * Resolve API-relative asset paths (e.g. /uploads/...) against VITE_API_BASE_URL
 * so logos/banners load when the frontend is on a different origin (Vercel).
 */
export function resolveAssetUrl(
  url: string | null | undefined,
): string | null {
  if (!url) {
    return null
  }

  const trimmed = url.trim()
  if (!trimmed) {
    return null
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed
  }

  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    "",
  )
  if (!base) {
    return trimmed
  }

  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`
}
