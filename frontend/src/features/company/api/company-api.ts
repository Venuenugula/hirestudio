import { apiClient } from "@/api/client"
import type {
  Company,
  CompanyMediaKind,
  CompanyMediaUploadResponse,
  CompanyUpdatePayload,
} from "@/features/company/types"

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

export function uploadCompanyMedia(kind: CompanyMediaKind, file: File) {
  const body = new FormData()
  body.append("kind", kind)
  body.append("file", file)
  return apiClient<CompanyMediaUploadResponse>(`${BASE}/me/media`, {
    method: "POST",
    body,
  })
}
