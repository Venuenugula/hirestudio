import { Outlet } from "react-router-dom"

import { ThemeToggle } from "@/components/shared/theme-toggle"

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex flex-1 items-center justify-center p-6">
        <Outlet />
      </main>
    </div>
  )
}
