export type PageTheme = {
  primaryColor: string
  secondaryColor: string
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

export type PageSection = HeroSection | AboutSection
export type SectionType = PageSection["type"]

export type PageConfig = {
  theme: PageTheme
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
