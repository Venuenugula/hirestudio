export const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "temporary",
] as const

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export type Job = {
  id: string
  company_id: string
  title: string
  department: string
  location: string
  employment_type: string
  description: string
  is_active: boolean
  application_url: string | null
  created_at: string
  updated_at: string
}

export type JobCreatePayload = {
  title: string
  department: string
  location: string
  employment_type: string
  description: string
  is_active: boolean
  application_url?: string | null
}

export type JobUpdatePayload = Partial<JobCreatePayload>

export type JobFilters = {
  title?: string
  department?: string
  location?: string
  employment_type?: string
  is_active?: boolean | null
}

export type JobListResponse = {
  items: Job[]
  total: number
}
