import { apiClient } from "@/api/client"
import type {
  CareersPage,
  PageConfig,
  PublishResult,
} from "@/features/pages/types"

function basePath(companyId: string) {
  return `/api/v1/careers-page/company/${companyId}`
}

export function getCareersPage(companyId: string) {
  return apiClient<CareersPage>(basePath(companyId))
}

export function updateCareersPageDraft(companyId: string, draftConfig: PageConfig) {
  return apiClient<CareersPage>(`${basePath(companyId)}/draft`, {
    method: "PATCH",
    body: { draft_config: draftConfig },
  })
}

export function publishCareersPage(companyId: string) {
  return apiClient<PublishResult>(`${basePath(companyId)}/publish`, {
    method: "POST",
  })
}
