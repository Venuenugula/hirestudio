import type {
  AboutSection,
  HeroSection,
  PageConfig,
  PageSection,
  PageTheme,
  SectionType,
} from "@/features/pages/types"

export const DEFAULT_THEME: PageTheme = {
  primaryColor: "#111111",
  secondaryColor: "#FFFFFF",
}

export const EMPTY_PAGE_CONFIG: PageConfig = {
  theme: { ...DEFAULT_THEME },
  sections: [],
}

function createId() {
  return crypto.randomUUID()
}

export function createHeroSection(
  overrides: Partial<Omit<HeroSection, "type" | "id">> = {},
): HeroSection {
  return {
    id: createId(),
    type: "hero",
    title: "Join our team",
    subtitle: "Build meaningful products with people who care.",
    ctaLabel: "View open roles",
    ...overrides,
  }
}

export function createAboutSection(
  overrides: Partial<Omit<AboutSection, "type" | "id">> = {},
): AboutSection {
  return {
    id: createId(),
    type: "about",
    title: "About us",
    body: "Tell candidates who you are and why your mission matters.",
    ...overrides,
  }
}

export function createSection(type: SectionType): PageSection {
  return type === "hero" ? createHeroSection() : createAboutSection()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
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
  }
}

function normalizeSection(value: unknown): PageSection | null {
  if (!isRecord(value) || typeof value.type !== "string") {
    return null
  }

  const id = typeof value.id === "string" && value.id ? value.id : createId()

  if (value.type === "hero") {
    return {
      id,
      type: "hero",
      title: typeof value.title === "string" ? value.title : "Join our team",
      subtitle:
        typeof value.subtitle === "string"
          ? value.subtitle
          : "Build meaningful products with people who care.",
      ctaLabel:
        typeof value.ctaLabel === "string" ? value.ctaLabel : "View open roles",
    }
  }

  if (value.type === "about") {
    return {
      id,
      type: "about",
      title: typeof value.title === "string" ? value.title : "About us",
      body:
        typeof value.body === "string"
          ? value.body
          : "Tell candidates who you are and why your mission matters.",
    }
  }

  return null
}

/** Normalize arbitrary JSONB draft into the MVP PageConfig shape. */
export function normalizePageConfig(raw: unknown): PageConfig {
  if (!isRecord(raw)) {
    return structuredClone(EMPTY_PAGE_CONFIG)
  }

  const sections = Array.isArray(raw.sections)
    ? raw.sections
        .map((section) => normalizeSection(section))
        .filter((section): section is PageSection => section !== null)
    : []

  return {
    theme: normalizeTheme(raw.theme),
    sections,
  }
}

export function serializePageConfig(config: PageConfig): PageConfig {
  return {
    theme: {
      primaryColor: config.theme.primaryColor,
      secondaryColor: config.theme.secondaryColor,
    },
    sections: config.sections.map((section) => {
      if (section.type === "hero") {
        return {
          id: section.id,
          type: "hero" as const,
          title: section.title,
          subtitle: section.subtitle,
          ctaLabel: section.ctaLabel,
        }
      }
      return {
        id: section.id,
        type: "about" as const,
        title: section.title,
        body: section.body,
      }
    }),
  }
}
