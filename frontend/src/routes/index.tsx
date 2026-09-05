import { Navigate, Route, Routes } from "react-router-dom"

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
import { RootLayout } from "@/layouts/root-layout"
import { GuestRoute } from "@/routes/guest-route"
import { ProtectedRoute } from "@/routes/protected-route"
import { routes } from "@/routes/paths"

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={routes.login} element={<LoginPage />} />
            <Route path={routes.register} element={<RegisterPage />} />
          </Route>
        </Route>

        <Route path="/careers/:slug" element={<PublicCareersPage />} />
        <Route
          path="/careers/:slug/jobs/:jobId"
          element={<PublicJobDetailPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path={routes.dashboard} element={<DashboardPage />} />
            <Route path={routes.company} element={<CompanyPage />} />
            <Route path={routes.careersPage} element={<CareersPageEditorPage />} />
            <Route path={routes.jobs} element={<JobsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={routes.home} replace />} />
      </Route>
    </Routes>
  )
}
