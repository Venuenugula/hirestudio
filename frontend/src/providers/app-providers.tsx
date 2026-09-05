import type { ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/providers/auth-provider"
import { QueryProvider } from "@/providers/query-provider"
import { AppThemeProvider } from "@/providers/theme-provider"
import { WorkspaceProvider } from "@/providers/workspace-provider"

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <AuthProvider>
            <WorkspaceProvider>
              {children}
              <Toaster richColors closeButton position="top-right" />
            </WorkspaceProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryProvider>
    </AppThemeProvider>
  )
}
