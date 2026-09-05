export const queryKeys = {
  health: ["health"] as const,
  companies: {
    all: ["companies"] as const,
    detail: (id: string) => ["companies", id] as const,
    bySlug: (slug: string) => ["companies", "slug", slug] as const,
  },
  careersPage: {
    byCompany: (companyId: string) => ["careers-page", companyId] as const,
  },
  jobs: {
    all: ["jobs"] as const,
    byCompany: (companyId: string) => ["jobs", "company", companyId] as const,
  },
} as const
