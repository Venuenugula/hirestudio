import { apiClient } from "@/api/client"
import type {
  Job,
  JobCreatePayload,
  JobFilters,
  JobListResponse,
  JobUpdatePayload,
} from "@/features/jobs/types"

const BASE = "/api/v1/jobs"

function buildQuery(filters: JobFilters = {}) {
  const params = new URLSearchParams()
  if (filters.title?.trim()) {
    params.set("title", filters.title.trim())
  }
  if (filters.department?.trim()) {
    params.set("department", filters.department.trim())
  }
  if (filters.location?.trim()) {
    params.set("location", filters.location.trim())
  }
  if (filters.employment_type?.trim()) {
    params.set("employment_type", filters.employment_type.trim())
  }
  if (filters.work_policy?.trim()) {
    params.set("work_policy", filters.work_policy.trim())
  }
  if (filters.experience_level?.trim()) {
    params.set("experience_level", filters.experience_level.trim())
  }
  if (filters.job_type?.trim()) {
    params.set("job_type", filters.job_type.trim())
  }
  if (filters.is_active === true || filters.is_active === false) {
    params.set("is_active", String(filters.is_active))
  }
  const query = params.toString()
  return query ? `?${query}` : ""
}

export function listJobs(_companyId: string, filters: JobFilters = {}) {
  return apiClient<JobListResponse>(`${BASE}${buildQuery(filters)}`)
}

export function createJob(_companyId: string, payload: JobCreatePayload) {
  return apiClient<Job>(BASE, {
    method: "POST",
    body: payload,
  })
}

export function updateJob(jobId: string, payload: JobUpdatePayload) {
  return apiClient<Job>(`${BASE}/${jobId}`, {
    method: "PATCH",
    body: payload,
  })
}

export function deleteJob(jobId: string) {
  return apiClient<void>(`${BASE}/${jobId}`, {
    method: "DELETE",
  })
}
