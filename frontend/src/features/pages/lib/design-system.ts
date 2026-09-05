import type { PageTheme } from "@/features/pages/types"

export const PAGE_STYLE_IDS = [
  "professional",
  "modern_saas",
  "minimal",
  "startup",
  "enterprise",
] as const

export type PageStyleId = (typeof PAGE_STYLE_IDS)[number]

export const THEME_PACK_IDS = [
  "ocean",
  "midnight",
  "forest",
  "sunset",
  "purple",
  "custom",
] as const

export type ThemePackId = (typeof THEME_PACK_IDS)[number]

export const FONT_IDS = [
  "inter",
  "manrope",
  "plus_jakarta",
  "dm_sans",
] as const

export type FontId = (typeof FONT_IDS)[number]

export const RADIUS_IDS = ["minimal", "modern", "friendly"] as const
export type RadiusId = (typeof RADIUS_IDS)[number]

export const BUTTON_STYLE_IDS = ["filled", "outline", "ghost", "pill"] as const
export type ButtonStyleId = (typeof BUTTON_STYLE_IDS)[number]

export const HERO_VARIANTS = ["stacked", "centered", "split", "banner"] as const
export type HeroVariant = (typeof HERO_VARIANTS)[number]

export const ABOUT_VARIANTS = ["text", "split"] as const
export type AboutVariant = (typeof ABOUT_VARIANTS)[number]

export const BENEFITS_VARIANTS = ["grid", "row", "list"] as const
export type BenefitsVariant = (typeof BENEFITS_VARIANTS)[number]

export const JOBS_VARIANTS = ["cards", "list"] as const
export type JobsVariant = (typeof JOBS_VARIANTS)[number]

export const CTA_VARIANTS = ["solid", "gradient", "minimal"] as const
export type CtaVariant = (typeof CTA_VARIANTS)[number]

export type PageStylePreset = {
  id: PageStyleId
  name: string
  description: string
  defaults: {
    fontId: FontId
    radiusId: RadiusId
    buttonStyle: ButtonStyleId
    heroVariant: HeroVariant
    aboutVariant: AboutVariant
    benefitsVariant: BenefitsVariant
    jobsVariant: JobsVariant
    ctaVariant: CtaVariant
  }
}

export const PAGE_STYLE_PRESETS: PageStylePreset[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean corporate layout with structured sections.",
    defaults: {
      fontId: "inter",
      radiusId: "minimal",
      buttonStyle: "filled",
      heroVariant: "stacked",
      aboutVariant: "text",
      benefitsVariant: "grid",
      jobsVariant: "cards",
      ctaVariant: "solid",
    },
  },
  {
    id: "modern_saas",
    name: "Modern SaaS",
    description: "Large type, soft radius, product-marketing energy.",
    defaults: {
      fontId: "plus_jakarta",
      radiusId: "modern",
      buttonStyle: "filled",
      heroVariant: "centered",
      aboutVariant: "split",
      benefitsVariant: "row",
      jobsVariant: "cards",
      ctaVariant: "gradient",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Whitespace-first and quiet typography.",
    defaults: {
      fontId: "dm_sans",
      radiusId: "minimal",
      buttonStyle: "outline",
      heroVariant: "centered",
      aboutVariant: "text",
      benefitsVariant: "list",
      jobsVariant: "list",
      ctaVariant: "minimal",
    },
  },
  {
    id: "startup",
    name: "Startup",
    description: "Bold hero, colorful accents, compact job cards.",
    defaults: {
      fontId: "manrope",
      radiusId: "friendly",
      buttonStyle: "pill",
      heroVariant: "split",
      aboutVariant: "split",
      benefitsVariant: "row",
      jobsVariant: "cards",
      ctaVariant: "gradient",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Premium, structured, denser information hierarchy.",
    defaults: {
      fontId: "inter",
      radiusId: "modern",
      buttonStyle: "filled",
      heroVariant: "banner",
      aboutVariant: "split",
      benefitsVariant: "grid",
      jobsVariant: "list",
      ctaVariant: "solid",
    },
  },
]

export type ThemePack = {
  id: Exclude<ThemePackId, "custom">
  name: string
  primaryColor: string
  secondaryColor: string
}

export const THEME_PACKS: ThemePack[] = [
  {
    id: "ocean",
    name: "Ocean",
    primaryColor: "#0F766E",
    secondaryColor: "#F0FDFA",
  },
  {
    id: "midnight",
    name: "Midnight",
    primaryColor: "#1E293B",
    secondaryColor: "#F1F5F9",
  },
  {
    id: "forest",
    name: "Forest",
    primaryColor: "#166534",
    secondaryColor: "#F7FEE7",
  },
  {
    id: "sunset",
    name: "Sunset",
    primaryColor: "#C2410C",
    secondaryColor: "#FFF7ED",
  },
  {
    id: "purple",
    name: "Purple",
    primaryColor: "#5B21B6",
    secondaryColor: "#F5F3FF",
  },
]

export const FONT_OPTIONS: { id: FontId; label: string; family: string }[] = [
  { id: "inter", label: "Inter", family: '"Inter", system-ui, sans-serif' },
  { id: "manrope", label: "Manrope", family: '"Manrope", system-ui, sans-serif' },
  {
    id: "plus_jakarta",
    label: "Plus Jakarta",
    family: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  { id: "dm_sans", label: "DM Sans", family: '"DM Sans", system-ui, sans-serif' },
]

export const RADIUS_OPTIONS: { id: RadiusId; label: string; value: string }[] = [
  { id: "minimal", label: "Minimal", value: "4px" },
  { id: "modern", label: "Modern", value: "12px" },
  { id: "friendly", label: "Friendly", value: "20px" },
]

export const BUTTON_STYLE_OPTIONS: {
  id: ButtonStyleId
  label: string
}[] = [
  { id: "filled", label: "Filled" },
  { id: "outline", label: "Outline" },
  { id: "ghost", label: "Ghost" },
  { id: "pill", label: "Pill" },
]

export const DEFAULT_DESIGN_THEME: {
  styleId: PageStyleId
  themePackId: ThemePackId
  fontId: FontId
  radiusId: RadiusId
  buttonStyle: ButtonStyleId
} = {
  styleId: "professional",
  themePackId: "custom",
  fontId: "inter",
  radiusId: "modern",
  buttonStyle: "filled",
}

export function resolveFontFamily(fontId: FontId | undefined): string {
  return (
    FONT_OPTIONS.find((option) => option.id === fontId)?.family ??
    FONT_OPTIONS[0].family
  )
}

export function resolveRadius(radiusId: RadiusId | undefined): string {
  return (
    RADIUS_OPTIONS.find((option) => option.id === radiusId)?.value ??
    RADIUS_OPTIONS[1].value
  )
}

export function getPageStylePreset(styleId: PageStyleId | undefined) {
  return (
    PAGE_STYLE_PRESETS.find((preset) => preset.id === styleId) ??
    PAGE_STYLE_PRESETS[0]
  )
}

export function themeFromPack(packId: ThemePackId): Partial<PageTheme> | null {
  if (packId === "custom") {
    return { themePackId: "custom" }
  }
  const pack = THEME_PACKS.find((item) => item.id === packId)
  if (!pack) {
    return null
  }
  return {
    themePackId: pack.id,
    primaryColor: pack.primaryColor,
    secondaryColor: pack.secondaryColor,
  }
}
