export type PageTheme = {
  primaryColor: string
  secondaryColor: string
}

export type PageTemplateMeta = {
  id: string
  version: number
}

export type HeroSection = {
  id: string
  type: "hero"
  title: string
  subtitle: string
  ctaLabel: string
}

export type AboutSection = {
  id: string
  type: "about"
  title: string
  body: string
}

export type BenefitItem = {
  id: string
  title: string
  description: string
}

export type BenefitsSection = {
  id: string
  type: "benefits"
  title: string
  items: BenefitItem[]
}

export type OpenRolesSection = {
  id: string
  type: "open_roles"
  title: string
  subtitle: string
}

export type CtaSection = {
  id: string
  type: "cta"
  title: string
  subtitle: string
  buttonLabel: string
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
