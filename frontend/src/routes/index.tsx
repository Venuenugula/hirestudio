import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { HomePage } from "@/features/auth/pages/home-page"
import { LoginPage } from "@/features/auth/pages/login-page"
import { CompanyPage } from "@/features/companies/pages/company-page"
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { JobsPage } from "@/features/jobs/pages/jobs-page"
import { CareersPageEditorPage } from "@/features/pages/pages/careers-page-editor-page"
import { AppLayout } from "@/layouts/app-layout"
import { AuthLayout } from "@/layouts/auth-layout"
import { RootLayout } from "@/layouts/root-layout"
import { routes } from "@/routes/paths"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AuthLayout />}>
            <Route path={routes.login} element={<LoginPage />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path={routes.dashboard} element={<DashboardPage />} />
            <Route path={routes.company} element={<CompanyPage />} />
            <Route path={routes.careersPage} element={<CareersPageEditorPage />} />
            <Route path={routes.jobs} element={<JobsPage />} />
          </Route>

          <Route path="*" element={<Navigate to={routes.home} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
