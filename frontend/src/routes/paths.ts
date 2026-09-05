export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  company: "/company",
  careersPage: "/careers-page",
  jobs: "/jobs",
  publicCareers: (slug: string) => `/careers/${slug}`,
  publicJob: (slug: string, jobId: string) => `/careers/${slug}/jobs/${jobId}`,
} as const

export type AppRoute =
  | (typeof routes)[Exclude<
      keyof typeof routes,
      "publicCareers" | "publicJob"
    >]
  | ReturnType<typeof routes.publicCareers>
  | ReturnType<typeof routes.publicJob>
