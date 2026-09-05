import { BrowserRouter, Route, Routes } from "react-router-dom"

import { RootLayout } from "@/layouts/root-layout"
import { HomePage } from "@/routes/home-page"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
