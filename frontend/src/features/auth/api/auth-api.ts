import { apiClient } from "@/api/client"
import type {
  AuthMeResponse,
  AuthSession,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types"

const BASE = "/api/v1/auth"

export function register(payload: RegisterPayload) {
  return apiClient<AuthSession>(`${BASE}/register`, {
    method: "POST",
    body: payload,
  })
}

export function login(payload: LoginPayload) {
  return apiClient<AuthSession>(`${BASE}/login`, {
    method: "POST",
    body: payload,
  })
}

export function getAuthMe() {
  return apiClient<AuthMeResponse>(`${BASE}/me`)
}

export function logoutRequest() {
  return apiClient<void>(`${BASE}/logout`, { method: "POST" })
}
