export type AuthUser = {
  id: string
  company_id: string
  full_name: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AuthSession = {
  access_token: string
  token_type: string
  user: AuthUser
  company: import("@/features/company/types").Company
}

export type AuthMeResponse = {
  user: AuthUser
  company: import("@/features/company/types").Company
}

export type RegisterPayload = {
  full_name: string
  email: string
  password: string
  company_name: string
  company_slug: string
  primary_color?: string
  secondary_color?: string
}

export type LoginPayload = {
  email: string
  password: string
}
