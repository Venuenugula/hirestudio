import { Navigate, Outlet, createBrowserRouter } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { HomePage } from "@/features/auth/pages/home-page"
import { LoginPage } from "@/features/auth/pages/login-page"
import { RegisterPage } from "@/features/auth/pages/register-page"
import { CompanyPage } from "@/features/company/pages/company-page"
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { JobsPage } from "@/features/jobs/pages/jobs-page"
import { CareersPageEditorPage } from "@/features/pages/pages/careers-page-editor-page"
import { PublicCareersPage } from "@/features/public/pages/public-careers-page"
import { PublicJobDetailPage } from "@/features/public/pages/public-job-detail-page"
import { AppLayout } from "@/layouts/app-layout"
import { AuthLayout } from "@/layouts/auth-layout"
import { AuthProvider } from "@/providers/auth-provider"
import { WorkspaceProvider } from "@/providers/workspace-provider"
import { GuestRoute } from "@/routes/guest-route"
import { ProtectedRoute } from "@/routes/protected-route"
import { routes } from "@/routes/paths"

/** Root layout hosts auth + workspace so route hooks (navigate/blocker) work. */
function RootLayout() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <Outlet />
        <Toaster richColors closeButton position="top-right" />
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: routes.login, element: <LoginPage /> },
              { path: routes.register, element: <RegisterPage /> },
            ],
          },
        ],
      },
      { path: "/careers/:slug", element: <PublicCareersPage /> },
      {
        path: "/careers/:slug/jobs/:jobId",
        element: <PublicJobDetailPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <HomePage /> },
              { path: routes.dashboard, element: <DashboardPage /> },
              { path: routes.company, element: <CompanyPage /> },
              {
                path: routes.careersPage,
                element: <CareersPageEditorPage />,
              },
              { path: routes.jobs, element: <JobsPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to={routes.home} replace /> },
    ],
  },
])
