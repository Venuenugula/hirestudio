import { z } from "zod"

import {
  ABOUT_VARIANTS,
  BENEFITS_VARIANTS,
  BUTTON_STYLE_IDS,
  CTA_VARIANTS,
  FONT_IDS,
  HERO_VARIANTS,
  JOBS_VARIANTS,
  PAGE_STYLE_IDS,
  RADIUS_IDS,
  THEME_PACK_IDS,
} from "@/features/pages/lib/design-system"

const sectionBaseSchema = {
  id: z.string().min(1),
  hidden: z.boolean().optional(),
}

export const pageThemeSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "Invalid hex color"),
  secondaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "Invalid hex color"),
  styleId: z.enum(PAGE_STYLE_IDS).optional(),
  themePackId: z.enum(THEME_PACK_IDS).optional(),
  fontId: z.enum(FONT_IDS).optional(),
  radiusId: z.enum(RADIUS_IDS).optional(),
  buttonStyle: z.enum(BUTTON_STYLE_IDS).optional(),
})

export const heroSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("hero"),
  title: z.string(),
  subtitle: z.string(),
  ctaLabel: z.string(),
  variant: z.enum(HERO_VARIANTS).optional(),
})

export const aboutSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("about"),
  title: z.string(),
  body: z.string(),
  variant: z.enum(ABOUT_VARIANTS).optional(),
})

export const benefitItemSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  description: z.string(),
})

export const benefitsSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("benefits"),
  title: z.string(),
  items: z.array(benefitItemSchema),
  variant: z.enum(BENEFITS_VARIANTS).optional(),
})

export const openRolesSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("open_roles"),
  title: z.string(),
  subtitle: z.string(),
  variant: z.enum(JOBS_VARIANTS).optional(),
})

export const ctaSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("cta"),
  title: z.string(),
  subtitle: z.string(),
  buttonLabel: z.string(),
  variant: z.enum(CTA_VARIANTS).optional(),
})

export const pageSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  aboutSectionSchema,
  benefitsSectionSchema,
  openRolesSectionSchema,
  ctaSectionSchema,
])

export const pageConfigSchema = z.object({
  theme: pageThemeSchema,
  template: z
    .object({
      id: z.string().min(1),
      version: z.number().int().positive(),
    })
    .optional(),
  sections: z.array(pageSectionSchema),
})

export type PageConfigInput = z.input<typeof pageConfigSchema>
