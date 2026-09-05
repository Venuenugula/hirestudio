import type {
  AboutVariant,
  BenefitsVariant,
  ButtonStyleId,
  CtaVariant,
  FontId,
  HeroVariant,
  JobsVariant,
  PageStyleId,
  RadiusId,
  ThemePackId,
} from "@/features/pages/lib/design-system"

export type PageTheme = {
  primaryColor: string
  secondaryColor: string
  styleId?: PageStyleId
  themePackId?: ThemePackId
  fontId?: FontId
  radiusId?: RadiusId
  buttonStyle?: ButtonStyleId
}

export type PageTemplateMeta = {
  id: string
  version: number
}

type SectionBase = {
  id: string
  hidden?: boolean
}

export type HeroSection = SectionBase & {
  type: "hero"
  title: string
  subtitle: string
  ctaLabel: string
  variant?: HeroVariant
}

export type AboutSection = SectionBase & {
  type: "about"
  title: string
  body: string
  variant?: AboutVariant
}

export type BenefitItem = {
  id: string
  title: string
  description: string
}

export type BenefitsSection = SectionBase & {
  type: "benefits"
  title: string
  items: BenefitItem[]
  variant?: BenefitsVariant
}

export type OpenRolesSection = SectionBase & {
  type: "open_roles"
  title: string
  subtitle: string
  variant?: JobsVariant
}

export type CtaSection = SectionBase & {
  type: "cta"
  title: string
  subtitle: string
  buttonLabel: string
  variant?: CtaVariant
}

export type PageSection =
  | HeroSection
  | AboutSection
  | BenefitsSection
  | OpenRolesSection
  | CtaSection

export type SectionType = PageSection["type"]

export type PageConfig = {
  theme: PageTheme
  template?: PageTemplateMeta
  sections: PageSection[]
}

export type CareersPage = {
  id: string
  company_id: string
  draft_config: Record<string, unknown>
  published_config: Record<string, unknown>
  published_at: string | null
  created_at: string
  updated_at: string
}

export type CareersPageDraftUpdate = {
  draft_config: PageConfig
}

export type PublishResult = CareersPage & {
  published_at: string
}

export type AutosaveStatus = "idle" | "dirty" | "saving" | "saved" | "error"
