import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

const STORAGE_KEY = "cpb.activeCompanyId"

type WorkspaceContextValue = {
  /** Active tenant company id. Null means no company selected yet (create flow). */
  companyId: string | null
  setCompanyId: (companyId: string | null) => void
  clearCompanyId: () => void
  hasCompany: boolean
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

function readInitialCompanyId(): string | null {
  const fromEnv = import.meta.env.VITE_ACTIVE_COMPANY_ID?.trim()
  if (fromEnv) {
    return fromEnv
  }

  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(STORAGE_KEY)
}

type WorkspaceProviderProps = {
  children: ReactNode
}

/**
 * Temporary workspace context.
 * Later replaced by authenticated user → company membership context.
 */
export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [companyId, setCompanyIdState] = useState<string | null>(() =>
    readInitialCompanyId(),
  )

  const setCompanyId = useCallback((nextId: string | null) => {
    setCompanyIdState(nextId)
    if (typeof window === "undefined") {
      return
    }
    if (nextId) {
      window.localStorage.setItem(STORAGE_KEY, nextId)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const clearCompanyId = useCallback(() => {
    setCompanyId(null)
  }, [setCompanyId])

  const value = useMemo(
    () => ({
      companyId,
      setCompanyId,
      clearCompanyId,
      hasCompany: Boolean(companyId),
    }),
    [companyId, setCompanyId, clearCompanyId],
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
