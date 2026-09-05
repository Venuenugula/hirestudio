import { Navigate, Outlet } from "react-router-dom"

import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { useAuth } from "@/providers/auth-provider"
import { routes } from "@/routes/paths"

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Restoring session" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />
  }

  return <Outlet />
}
