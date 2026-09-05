import { z } from "zod"

export const pageThemeSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "Invalid hex color"),
  secondaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "Invalid hex color"),
})

export const heroSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  title: z.string(),
  subtitle: z.string(),
  ctaLabel: z.string(),
})

export const aboutSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("about"),
  title: z.string(),
  body: z.string(),
})

export const pageSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  aboutSectionSchema,
])

export const pageConfigSchema = z.object({
  theme: pageThemeSchema,
  sections: z.array(pageSectionSchema),
})

export type PageConfigInput = z.input<typeof pageConfigSchema>
