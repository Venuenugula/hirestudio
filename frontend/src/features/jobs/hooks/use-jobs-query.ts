import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { listJobs } from "@/features/jobs/api/jobs-api"
import type { JobFilters } from "@/features/jobs/types"

export function useJobsQuery(companyId: string | null, filters: JobFilters = {}) {
  const normalizedFilters = {
    title: filters.title?.trim() || undefined,
    department: filters.department?.trim() || undefined,
    location: filters.location?.trim() || undefined,
    employment_type: filters.employment_type?.trim() || undefined,
    is_active:
      filters.is_active === true || filters.is_active === false
        ? filters.is_active
        : undefined,
  }

  return useQuery({
    queryKey: companyId
      ? queryKeys.jobs.byCompany(companyId, normalizedFilters)
      : (["jobs", "none"] as const),
    queryFn: () => {
      if (!companyId) {
        throw new Error("Company id is required")
      }
      return listJobs(companyId, normalizedFilters)
    },
    enabled: Boolean(companyId),
    placeholderData: keepPreviousData,
  })
}
