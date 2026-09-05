import { apiClient } from "@/api/client"
import type {
  PublicJobDetailResponse,
  PublicSiteResponse,
} from "@/features/public/types"

const publicPath = (slug: string) => `/api/v1/public/${encodeURIComponent(slug)}`

export function getPublicSite(slug: string) {
  return apiClient<PublicSiteResponse>(publicPath(slug))
}

export function getPublicJob(slug: string, jobId: string) {
  return apiClient<PublicJobDetailResponse>(
    `${publicPath(slug)}/jobs/${encodeURIComponent(jobId)}`,
  )
}
