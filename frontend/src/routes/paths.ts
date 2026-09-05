export const routes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  company: "/company",
  careersPage: "/careers-page",
  jobs: "/jobs",
} as const

export type AppRoute = (typeof routes)[keyof typeof routes]
