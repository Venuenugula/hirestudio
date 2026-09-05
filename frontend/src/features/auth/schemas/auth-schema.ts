import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(255),
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  company_name: z.string().trim().min(1, "Company name is required").max(255),
  company_slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
      "Use letters, numbers, and hyphens only",
    ),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const loginDefaults: LoginFormValues = {
  email: "",
  password: "",
}

export const registerDefaults: RegisterFormValues = {
  full_name: "",
  email: "",
  password: "",
  company_name: "",
  company_slug: "",
}
