import type { Company } from "@/features/company/types"
import { DEFAULT_THEME } from "@/features/pages/lib/page-config"
import type { PageTheme } from "@/features/pages/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Prefer theme from published_config when present; otherwise use company brand colors.
 */
export function resolvePublicTheme(
  publishedConfig: Record<string, unknown> | null | undefined,
  company: Pick<Company, "primary_color" | "secondary_color">,
): PageTheme {
  const rawTheme =
    isRecord(publishedConfig) && isRecord(publishedConfig.theme)
      ? publishedConfig.theme
      : null

  return {
    primaryColor:
      typeof rawTheme?.primaryColor === "string" && rawTheme.primaryColor
        ? rawTheme.primaryColor
        : company.primary_color || DEFAULT_THEME.primaryColor,
    secondaryColor:
      typeof rawTheme?.secondaryColor === "string" && rawTheme.secondaryColor
        ? rawTheme.secondaryColor
        : company.secondary_color || DEFAULT_THEME.secondaryColor,
  }
}

export function buildMetaDescription(options: {
  companyName: string
  aboutBody?: string
  heroSubtitle?: string
}): string {
  const about = options.aboutBody?.trim()
  if (about) {
    return about.length > 160 ? `${about.slice(0, 157)}…` : about
  }

  const subtitle = options.heroSubtitle?.trim()
  if (subtitle) {
    return subtitle.length > 160 ? `${subtitle.slice(0, 157)}…` : subtitle
  }

  return `Explore open roles and careers at ${options.companyName}.`
}
