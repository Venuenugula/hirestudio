import { Navigate } from "react-router-dom"

import { routes } from "@/routes/paths"

/** Authenticated root redirects to the recruiter dashboard. */
export function HomePage() {
  return <Navigate to={routes.dashboard} replace />
}
