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
    byCompany: (companyId: string, filters: Record<string, unknown> = {}) =>
      ["jobs", "company", companyId, filters] as const,
  },
  public: {
    site: (slug: string) => ["public", "site", slug] as const,
    job: (slug: string, jobId: string) =>
      ["public", "job", slug, jobId] as const,
  },
} as const
