import type { ReactNode } from "react"

import { Toaster } from "@/components/ui/sonner"
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
        <WorkspaceProvider>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </WorkspaceProvider>
      </QueryProvider>
    </AppThemeProvider>
  )
}
