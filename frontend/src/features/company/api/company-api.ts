import { apiClient } from "@/api/client"
import type {
  Company,
  CompanyCreatePayload,
  CompanyUpdatePayload,
} from "@/features/company/types"

const BASE = "/api/v1/company"

export function getCompanyById(companyId: string) {
  return apiClient<Company>(`${BASE}/${companyId}`)
}

export function createCompany(payload: CompanyCreatePayload) {
  return apiClient<Company>(`${BASE}/`, {
    method: "POST",
    body: payload,
  })
}

export function updateCompany(companyId: string, payload: CompanyUpdatePayload) {
  return apiClient<Company>(`${BASE}/${companyId}`, {
    method: "PATCH",
    body: payload,
  })
}
