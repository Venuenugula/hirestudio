import { apiClient } from "@/api/client"
import type { Company, CompanyUpdatePayload } from "@/features/company/types"

const BASE = "/api/v1/company"

export function getMyCompany() {
  return apiClient<Company>(`${BASE}/me`)
}

export function updateMyCompany(payload: CompanyUpdatePayload) {
  return apiClient<Company>(`${BASE}/me`, {
    method: "PATCH",
    body: payload,
  })
}
