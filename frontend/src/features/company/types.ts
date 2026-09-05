export type Company = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  banner_url: string | null
  website: string | null
  industry: string | null
  company_size: string | null
  primary_color: string
  secondary_color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CompanyCreatePayload = {
  name: string
  slug: string
  logo_url?: string | null
  banner_url?: string | null
  website?: string | null
  industry?: string | null
  company_size?: string | null
  primary_color: string
  secondary_color: string
  is_active: boolean
}

export type CompanyUpdatePayload = Partial<CompanyCreatePayload>

export type CompanyMediaKind = "logo" | "banner"

export type CompanyMediaUploadResponse = {
  url: string
  kind: CompanyMediaKind
}

export const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
] as const

export const INDUSTRY_SUGGESTIONS = [
  "Software",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "AI / ML",
  "Education",
  "Consulting",
  "Media",
] as const
