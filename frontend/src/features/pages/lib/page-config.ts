import type {
  AboutSection,
  BenefitItem,
  BenefitsSection,
  CtaSection,
  HeroSection,
  OpenRolesSection,
  PageConfig,
  PageSection,
  PageTemplateMeta,
  PageTheme,
  SectionType,
} from "@/features/pages/types"
import {
  ABOUT_VARIANTS,
  BENEFITS_VARIANTS,
  BUTTON_STYLE_IDS,
  CTA_VARIANTS,
  DEFAULT_DESIGN_THEME,
  FONT_IDS,
  HERO_VARIANTS,
  JOBS_VARIANTS,
  PAGE_STYLE_IDS,
  RADIUS_IDS,
  THEME_PACK_IDS,
  getPageStylePreset,
  type PageStyleId,
} from "@/features/pages/lib/design-system"

export const DEFAULT_THEME: PageTheme = {
  primaryColor: "#0F766E",
  secondaryColor: "#F8FAFC",
  ...DEFAULT_DESIGN_THEME,
}

export const EMPTY_PAGE_CONFIG: PageConfig = {
  theme: { ...DEFAULT_THEME },
  sections: [],
}

export const SUPPORTED_SECTION_TYPES: SectionType[] = [
  "hero",
  "about",
  "benefits",
  "open_roles",
  "cta",
]

export const COMING_SOON_SECTION_TYPES = [
  "testimonials",
  "gallery",
  "faq",
] as const

export type ComingSoonSectionType = (typeof COMING_SOON_SECTION_TYPES)[number]

function createId() {
  return crypto.randomUUID()
}

function applyHidden<T extends PageSection>(
  section: Omit<T, "hidden"> & { hidden?: boolean },
): T {
  if (section.hidden === true) {
    return { ...section, hidden: true } as T
  }
  const { hidden: _removed, ...rest } = section
  return rest as T
}

export function createHeroSection(
  overrides: Partial<Omit<HeroSection, "type" | "id">> = {},
): HeroSection {
  return applyHidden<HeroSection>({
    id: createId(),
    type: "hero",
    title: "Join our team",
    subtitle:
      "Help us build the future. Explore opportunities to grow your career.",
    ctaLabel: "View open roles",
    variant: "stacked",
    ...overrides,
  })
}

export function createAboutSection(
  overrides: Partial<Omit<AboutSection, "type" | "id">> = {},
): AboutSection {
  return applyHidden<AboutSection>({
    id: createId(),
    type: "about",
    title: "About us",
    body: "Customize this section to tell candidates about your mission, culture, and values.",
    variant: "text",
    ...overrides,
  })
}

export function createBenefitItem(
  overrides: Partial<Omit<BenefitItem, "id">> = {},
): BenefitItem {
  return {
    id: createId(),
    title: "New benefit",
    description: "Describe what candidates get.",
    ...overrides,
  }
}

export function createBenefitsSection(
  overrides: Partial<Omit<BenefitsSection, "type" | "id">> = {},
): BenefitsSection {
  return applyHidden<BenefitsSection>({
    id: createId(),
    type: "benefits",
    title: "Benefits & perks",
    variant: "grid",
    items: [
      createBenefitItem({
        title: "Flexible Work",
        description: "Work in a way that fits your life.",
      }),
      createBenefitItem({
        title: "Learning Budget",
        description: "Invest in courses, books, and conferences.",
      }),
      createBenefitItem({
        title: "Health Insurance",
        description: "Comprehensive coverage for you and your family.",
      }),
      createBenefitItem({
        title: "Career Growth",
        description:
          "Clear paths and opportunities to take on bigger challenges.",
      }),
    ],
    ...overrides,
  })
}

export function createOpenRolesSection(
  overrides: Partial<Omit<OpenRolesSection, "type" | "id">> = {},
): OpenRolesSection {
  return applyHidden<OpenRolesSection>({
    id: createId(),
    type: "open_roles",
    title: "Open roles",
    subtitle: "Find a role that matches your skills and ambitions.",
    variant: "cards",
    ...overrides,
  })
}

export function createCtaSection(
  overrides: Partial<Omit<CtaSection, "type" | "id">> = {},
): CtaSection {
  return applyHidden<CtaSection>({
    id: createId(),
    type: "cta",
    title: "Ready to make an impact?",
    subtitle: "Browse our open positions.",
    buttonLabel: "See open roles",
    variant: "solid",
    ...overrides,
  })
}

export function createSection(type: SectionType): PageSection {
  switch (type) {
    case "hero":
      return createHeroSection()
    case "about":
      return createAboutSection()
    case "benefits":
      return createBenefitsSection()
    case "open_roles":
      return createOpenRolesSection()
    case "cta":
      return createCtaSection()
  }
}

export function isSectionHidden(section: PageSection): boolean {
  return section.hidden === true
}

export function isSectionVisible(section: PageSection): boolean {
  return !isSectionHidden(section)
}

export function canDeleteSection(section: PageSection): boolean {
  return section.type !== "hero" && section.type !== "open_roles"
}

export function duplicateSection(section: PageSection): PageSection {
  switch (section.type) {
    case "hero":
      return createHeroSection({
        title: section.title,
        subtitle: section.subtitle,
        ctaLabel: section.ctaLabel,
        variant: section.variant,
        hidden: section.hidden,
      })
    case "about":
      return createAboutSection({
        title: section.title,
        body: section.body,
        variant: section.variant,
        hidden: section.hidden,
      })
    case "benefits":
      return createBenefitsSection({
        title: section.title,
        variant: section.variant,
        hidden: section.hidden,
        items: section.items.map((item) =>
          createBenefitItem({
            title: item.title,
            description: item.description,
          }),
        ),
      })
    case "open_roles":
      return createOpenRolesSection({
        title: section.title,
        subtitle: section.subtitle,
        variant: section.variant,
        hidden: section.hidden,
      })
    case "cta":
      return createCtaSection({
        title: section.title,
        subtitle: section.subtitle,
        buttonLabel: section.buttonLabel,
        variant: section.variant,
        hidden: section.hidden,
      })
  }
}

export function reorderSections(
  sections: PageSection[],
  activeId: string,
  overId: string,
): PageSection[] {
  const oldIndex = sections.findIndex((section) => section.id === activeId)
  const newIndex = sections.findIndex((section) => section.id === overId)
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return sections
  }
  const next = [...sections]
  const [moved] = next.splice(oldIndex, 1)
  next.splice(newIndex, 0, moved)
  return next
}

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

function normalizeTheme(value: unknown): PageTheme {
  if (!isRecord(value)) {
    return { ...DEFAULT_THEME }
  }

  return {
    primaryColor:
      typeof value.primaryColor === "string" && value.primaryColor
        ? value.primaryColor
        : DEFAULT_THEME.primaryColor,
    secondaryColor:
      typeof value.secondaryColor === "string" && value.secondaryColor
        ? value.secondaryColor
        : DEFAULT_THEME.secondaryColor,
    styleId: oneOf(value.styleId, PAGE_STYLE_IDS, DEFAULT_THEME.styleId!),
    themePackId: oneOf(
      value.themePackId,
      THEME_PACK_IDS,
      DEFAULT_THEME.themePackId!,
    ),
    fontId: oneOf(value.fontId, FONT_IDS, DEFAULT_THEME.fontId!),
    radiusId: oneOf(value.radiusId, RADIUS_IDS, DEFAULT_THEME.radiusId!),
    buttonStyle: oneOf(
      value.buttonStyle,
      BUTTON_STYLE_IDS,
      DEFAULT_THEME.buttonStyle!,
    ),
  }
}

function normalizeBenefitItem(value: unknown): BenefitItem | null {
  if (!isRecord(value)) {
    return null
  }

  return {
    id: typeof value.id === "string" && value.id ? value.id : createId(),
    title: typeof value.title === "string" ? value.title : "Benefit",
    description:
      typeof value.description === "string" ? value.description : "",
  }
}

function readHidden(value: Record<string, unknown>): boolean | undefined {
  return value.hidden === true ? true : undefined
}

function normalizeSection(value: unknown): PageSection | null {
  if (!isRecord(value) || typeof value.type !== "string") {
    return null
  }

  const id = typeof value.id === "string" && value.id ? value.id : createId()
  const hidden = readHidden(value)

  if (value.type === "hero") {
    return applyHidden<HeroSection>({
      id,
      type: "hero",
      title: typeof value.title === "string" ? value.title : "Join our team",
      subtitle:
        typeof value.subtitle === "string"
          ? value.subtitle
          : "Help us build the future. Explore opportunities to grow your career.",
      ctaLabel:
        typeof value.ctaLabel === "string"
          ? value.ctaLabel
          : "View open roles",
      variant: oneOf(value.variant, HERO_VARIANTS, "stacked"),
      hidden,
    })
  }

  if (value.type === "about") {
    return applyHidden<AboutSection>({
      id,
      type: "about",
      title: typeof value.title === "string" ? value.title : "About us",
      body:
        typeof value.body === "string"
          ? value.body
          : "Customize this section to tell candidates about your mission, culture, and values.",
      variant: oneOf(value.variant, ABOUT_VARIANTS, "text"),
      hidden,
    })
  }

  if (value.type === "benefits") {
    const items = Array.isArray(value.items)
      ? value.items
          .map((item) => normalizeBenefitItem(item))
          .filter((item): item is BenefitItem => item !== null)
      : []

    return applyHidden<BenefitsSection>({
      id,
      type: "benefits",
      title:
        typeof value.title === "string" ? value.title : "Benefits & perks",
      variant: oneOf(value.variant, BENEFITS_VARIANTS, "grid"),
      items:
        items.length > 0
          ? items
          : [
              createBenefitItem({
                title: "Flexible Work",
                description: "Work in a way that fits your life.",
              }),
            ],
      hidden,
    })
  }

  if (value.type === "open_roles") {
    return applyHidden<OpenRolesSection>({
      id,
      type: "open_roles",
      title: typeof value.title === "string" ? value.title : "Open roles",
      subtitle:
        typeof value.subtitle === "string"
          ? value.subtitle
          : "Find a role that matches your skills and ambitions.",
      variant: oneOf(value.variant, JOBS_VARIANTS, "cards"),
      hidden,
    })
  }

  if (value.type === "cta") {
    return applyHidden<CtaSection>({
      id,
      type: "cta",
      title:
        typeof value.title === "string"
          ? value.title
          : "Ready to make an impact?",
      subtitle:
        typeof value.subtitle === "string"
          ? value.subtitle
          : "Browse our open positions.",
      buttonLabel:
        typeof value.buttonLabel === "string"
          ? value.buttonLabel
          : "See open roles",
      variant: oneOf(value.variant, CTA_VARIANTS, "solid"),
      hidden,
    })
  }

  return null
}

function normalizeTemplate(
  value: unknown,
  raw: Record<string, unknown>,
): PageTemplateMeta | undefined {
  if (isRecord(value)) {
    const id = typeof value.id === "string" && value.id ? value.id : null
    const version =
      typeof value.version === "number" && Number.isFinite(value.version)
        ? Math.max(1, Math.trunc(value.version))
        : 1
    if (id) {
      return { id, version }
    }
  }

  if (typeof raw.templateId === "string" && raw.templateId) {
    return { id: raw.templateId, version: 1 }
  }

  return undefined
}

/** Normalize arbitrary JSONB draft into the PageConfig shape. */
export function normalizePageConfig(raw: unknown): PageConfig {
  if (!isRecord(raw)) {
    return structuredClone(EMPTY_PAGE_CONFIG)
  }

  const sections = Array.isArray(raw.sections)
    ? raw.sections
        .map((section) => normalizeSection(section))
        .filter((section): section is PageSection => section !== null)
    : []

  const template = normalizeTemplate(raw.template, raw)

  return {
    theme: normalizeTheme(raw.theme),
    ...(template ? { template } : {}),
    sections,
  }
}

function serializeSection(section: PageSection): PageSection {
  const hidden = section.hidden === true ? { hidden: true as const } : {}

  switch (section.type) {
    case "hero":
      return {
        id: section.id,
        type: "hero",
        title: section.title,
        subtitle: section.subtitle,
        ctaLabel: section.ctaLabel,
        variant: section.variant ?? "stacked",
        ...hidden,
      }
    case "about":
      return {
        id: section.id,
        type: "about",
        title: section.title,
        body: section.body,
        variant: section.variant ?? "text",
        ...hidden,
      }
    case "benefits":
      return {
        id: section.id,
        type: "benefits",
        title: section.title,
        variant: section.variant ?? "grid",
        items: section.items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
        })),
        ...hidden,
      }
    case "open_roles":
      return {
        id: section.id,
        type: "open_roles",
        title: section.title,
        subtitle: section.subtitle,
        variant: section.variant ?? "cards",
        ...hidden,
      }
    case "cta":
      return {
        id: section.id,
        type: "cta",
        title: section.title,
        subtitle: section.subtitle,
        buttonLabel: section.buttonLabel,
        variant: section.variant ?? "solid",
        ...hidden,
      }
  }
}

export function serializePageConfig(config: PageConfig): PageConfig {
  return {
    theme: {
      primaryColor: config.theme.primaryColor,
      secondaryColor: config.theme.secondaryColor,
      styleId: config.theme.styleId,
      themePackId: config.theme.themePackId,
      fontId: config.theme.fontId,
      radiusId: config.theme.radiusId,
      buttonStyle: config.theme.buttonStyle,
    },
    ...(config.template
      ? {
          template: {
            id: config.template.id,
            version: config.template.version,
          },
        }
      : {}),
    sections: config.sections.map((section) => serializeSection(section)),
  }
}

/** Apply a visual style preset to theme tokens and section layout variants. */
export function applyPageStylePreset(
  config: PageConfig,
  styleId: PageStyleId,
): PageConfig {
  const preset = getPageStylePreset(styleId)
  return {
    ...config,
    theme: {
      ...config.theme,
      styleId: preset.id,
      fontId: preset.defaults.fontId,
      radiusId: preset.defaults.radiusId,
      buttonStyle: preset.defaults.buttonStyle,
    },
    sections: config.sections.map((section) => {
      if (section.type === "hero") {
        return { ...section, variant: preset.defaults.heroVariant }
      }
      if (section.type === "about") {
        return { ...section, variant: preset.defaults.aboutVariant }
      }
      if (section.type === "benefits") {
        return { ...section, variant: preset.defaults.benefitsVariant }
      }
      if (section.type === "open_roles") {
        return { ...section, variant: preset.defaults.jobsVariant }
      }
      return { ...section, variant: preset.defaults.ctaVariant }
    }),
  }
}

export function sectionLabel(type: SectionType | ComingSoonSectionType): string {
  switch (type) {
    case "hero":
      return "Hero"
    case "about":
      return "About"
    case "benefits":
      return "Benefits"
    case "open_roles":
      return "Open Roles"
    case "cta":
      return "CTA"
    case "testimonials":
      return "Testimonials"
    case "gallery":
      return "Gallery"
    case "faq":
      return "FAQ"
  }
}

/** Preferred public page flow: story → jobs → closing CTA. */
export const PUBLIC_SECTION_ORDER: SectionType[] = [
  "hero",
  "about",
  "benefits",
  "open_roles",
  "cta",
]

export function sortSectionsForPublic(sections: PageSection[]): PageSection[] {
  const rank = (type: SectionType) => {
    const index = PUBLIC_SECTION_ORDER.indexOf(type)
    return index === -1 ? PUBLIC_SECTION_ORDER.length : index
  }
  return [...sections].sort((a, b) => rank(a.type) - rank(b.type))
}

export function sectionPreviewTitle(section: PageSection): string {
  return section.title?.trim() || sectionLabel(section.type)
}
