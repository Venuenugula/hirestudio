import { z } from "zod"

import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORK_POLICIES,
} from "@/features/jobs/constants"

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

const optionalSalary = z
  .string()
  .max(150)
  .transform((value) => {
    const trimmed = value.trim()
    return trimmed === "" ? null : trimmed
  })

export const jobFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  department: z.string().trim().min(1, "Department is required").max(150),
  location: z.string().trim().min(1, "Location is required").max(255),
  employment_type: z.enum(EMPLOYMENT_TYPES),
  work_policy: z.enum(WORK_POLICIES),
  experience_level: z.enum(EXPERIENCE_LEVELS),
  job_type: z.enum(JOB_TYPES),
  salary_range: optionalSalary,
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
  work_policy: "remote",
  experience_level: "mid_level",
  job_type: "permanent",
  salary_range: "",
  description: "",
  is_active: true,
  application_url: "",
}
