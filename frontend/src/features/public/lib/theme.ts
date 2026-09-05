import type { Company } from "@/features/company/types"
import {
  BUTTON_STYLE_IDS,
  DEFAULT_DESIGN_THEME,
  FONT_IDS,
  PAGE_STYLE_IDS,
  RADIUS_IDS,
  THEME_PACK_IDS,
} from "@/features/pages/lib/design-system"
import { DEFAULT_THEME } from "@/features/pages/lib/page-config"
import type { PageTheme } from "@/features/pages/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

/**
 * Prefer theme from page config when present; otherwise use company brand colors.
 * Preserves design-system fields (style, font, radius, button).
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
    styleId: oneOf(
      rawTheme?.styleId,
      PAGE_STYLE_IDS,
      DEFAULT_DESIGN_THEME.styleId,
    ),
    themePackId: oneOf(
      rawTheme?.themePackId,
      THEME_PACK_IDS,
      DEFAULT_DESIGN_THEME.themePackId,
    ),
    fontId: oneOf(rawTheme?.fontId, FONT_IDS, DEFAULT_DESIGN_THEME.fontId),
    radiusId: oneOf(
      rawTheme?.radiusId,
      RADIUS_IDS,
      DEFAULT_DESIGN_THEME.radiusId,
    ),
    buttonStyle: oneOf(
      rawTheme?.buttonStyle,
      BUTTON_STYLE_IDS,
      DEFAULT_DESIGN_THEME.buttonStyle,
    ),
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
