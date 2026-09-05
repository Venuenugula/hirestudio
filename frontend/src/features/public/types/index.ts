import type { Company } from "@/features/company/types"
import type { Job } from "@/features/jobs/types"

export type PublicCareersPage = {
  id: string
  company_id: string
  published_config: Record<string, unknown>
  published_at: string | null
}

export type PublicSiteResponse = {
  company: Company
  careers_page: PublicCareersPage | null
  jobs: Job[]
}

export type PublicJobDetailResponse = {
  company: Company
  job: Job
}
