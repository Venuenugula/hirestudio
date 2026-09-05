import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react"

import { useAuth } from "@/providers/auth-provider"

type WorkspaceContextValue = {
  /** Active tenant company id from the authenticated recruiter. */
  companyId: string | null
  hasCompany: boolean
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

type WorkspaceProviderProps = {
  children: ReactNode
}

/**
 * Workspace context derived from the authenticated user's company.
 */
export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const { company, isAuthenticated } = useAuth()
  const companyId = isAuthenticated ? (company?.id ?? null) : null

  const value = useMemo(
    () => ({
      companyId,
      hasCompany: Boolean(companyId),
    }),
    [companyId],
  )

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider")
  }
  return context
}
