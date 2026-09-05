export type Company = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  banner_url: string | null
  primary_color: string
  secondary_color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CompanyCreatePayload = {
  name: string
  slug: string
  logo_url?: string | null
  banner_url?: string | null
  primary_color: string
  secondary_color: string
  is_active: boolean
}

export type CompanyUpdatePayload = Partial<CompanyCreatePayload>
