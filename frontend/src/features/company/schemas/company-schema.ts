import { z } from "zod"

const optionalUrl = z
  .string()
  .max(1024, "URL must be at most 1024 characters")
  .refine(
    (value) => value.trim() === "" || /^https?:\/\/.+/i.test(value.trim()),
    "Enter a valid http(s) URL or leave blank",
  )
  .transform((value) => {
    const trimmed = value.trim()
    return trimmed === "" ? null : trimmed
  })

const colorSchema = z
  .string()
  .min(1, "Color is required")
  .max(32, "Color must be at most 32 characters")
  .regex(
    /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/,
    "Use a hex color like #111111",
  )

export const companyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(255, "Name must be at most 255 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters"),
  logo_url: optionalUrl,
  banner_url: optionalUrl,
  primary_color: colorSchema,
  secondary_color: colorSchema,
  is_active: z.boolean(),
})

export type CompanyFormValues = z.input<typeof companyFormSchema>
export type CompanyFormParsed = z.output<typeof companyFormSchema>

export const companyFormDefaults: CompanyFormValues = {
  name: "",
  slug: "",
  logo_url: "",
  banner_url: "",
  primary_color: "#111111",
  secondary_color: "#FFFFFF",
  is_active: true,
}
