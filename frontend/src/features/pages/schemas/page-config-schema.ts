import { z } from "zod"

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
})

export const heroSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("hero"),
  title: z.string(),
  subtitle: z.string(),
  ctaLabel: z.string(),
})

export const aboutSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("about"),
  title: z.string(),
  body: z.string(),
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
})

export const openRolesSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("open_roles"),
  title: z.string(),
  subtitle: z.string(),
})

export const ctaSectionSchema = z.object({
  ...sectionBaseSchema,
  type: z.literal("cta"),
  title: z.string(),
  subtitle: z.string(),
  buttonLabel: z.string(),
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
