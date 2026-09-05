import { apiClient } from "@/api/client"
import type {
  CareersPage,
  PageConfig,
  PublishResult,
} from "@/features/pages/types"

const BASE = "/api/v1/careers-page/me"

export function getCareersPage(_companyId?: string) {
  return apiClient<CareersPage>(BASE)
}

export function updateCareersPageDraft(
  _companyId: string | undefined,
  draftConfig: PageConfig,
) {
  return apiClient<CareersPage>(`${BASE}/draft`, {
    method: "PATCH",
    body: { draft_config: draftConfig },
  })
}

export function publishCareersPage(_companyId?: string) {
  return apiClient<PublishResult>(`${BASE}/publish`, {
    method: "POST",
  })
}
