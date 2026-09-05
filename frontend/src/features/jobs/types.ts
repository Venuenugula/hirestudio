import type {
  EmploymentType,
  ExperienceLevel,
  JobType,
  WorkPolicy,
} from "@/features/jobs/constants"

export type Job = {
  id: string
  company_id: string
  title: string
  department: string
  location: string
  employment_type: string
  work_policy: string
  experience_level: string
  job_type: string
  salary_range: string | null
  description: string
  is_active: boolean
  application_url: string | null
  posted_at: string
  created_at: string
  updated_at: string
}

export type JobCreatePayload = {
  title: string
  department: string
  location: string
  employment_type: EmploymentType
  work_policy: WorkPolicy
  experience_level: ExperienceLevel
  job_type: JobType
  salary_range?: string | null
  description: string
  is_active: boolean
  application_url?: string | null
  posted_at?: string
}

export type JobUpdatePayload = Partial<JobCreatePayload>

export type JobFilters = {
  title?: string
  department?: string
  location?: string
  employment_type?: string
  work_policy?: string
  experience_level?: string
  job_type?: string
  is_active?: boolean | null
}

export type JobListResponse = {
  items: Job[]
  total: number
}

/** @deprecated Import EMPLOYMENT_TYPES from constants.ts */
export { EMPLOYMENT_TYPES } from "@/features/jobs/constants"
export type { EmploymentType } from "@/features/jobs/constants"
