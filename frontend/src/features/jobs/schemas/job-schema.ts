import { z } from "zod"

import { EMPLOYMENT_TYPES } from "@/features/jobs/types"

const optionalUrl = z
  .string()
  .max(1024)
  .refine(
    (value) => value.trim() === "" || /^https?:\/\/.+/i.test(value.trim()),
    "Enter a valid http(s) URL or leave blank",
  )
  .transform((value) => {
    const trimmed = value.trim()
    return trimmed === "" ? null : trimmed
  })

export const jobFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  department: z.string().trim().min(1, "Department is required").max(150),
  location: z.string().trim().min(1, "Location is required").max(255),
  employment_type: z.enum(EMPLOYMENT_TYPES),
  description: z.string().trim().min(1, "Description is required"),
  is_active: z.boolean(),
  application_url: optionalUrl,
})

export type JobFormValues = z.input<typeof jobFormSchema>
export type JobFormParsed = z.output<typeof jobFormSchema>

export const jobFormDefaults: JobFormValues = {
  title: "",
  department: "",
  location: "",
  employment_type: "full_time",
  description: "",
  is_active: true,
  application_url: "",
}
