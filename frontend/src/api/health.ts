import { apiClient } from "@/api/client"

export type HealthResponse = {
  status: string
}

export function getHealth() {
  return apiClient<HealthResponse>("/api/v1/health")
}
