import type { ReactNode } from "react"

import { QueryProvider } from "@/providers/query-provider"
import { AppThemeProvider } from "@/providers/theme-provider"

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </AppThemeProvider>
  )
}
