import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useNavigate } from "react-router-dom"

import { setAuthToken, setUnauthorizedHandler } from "@/api/client"
import {
  getAuthMe,
  login as loginRequest,
  logoutRequest,
  register as registerRequest,
} from "@/features/auth/api/auth-api"
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types"
import type { Company } from "@/features/company/types"
import { routes } from "@/routes/paths"

const TOKEN_KEY = "cpb.accessToken"

type AuthContextValue = {
  user: AuthUser | null
  company: Company | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  setCompany: (company: Company) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return window.localStorage.getItem(TOKEN_KEY)
}

function persistToken(token: string | null) {
  if (typeof window === "undefined") {
    return
  }
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(TOKEN_KEY)
  }
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const [token, setTokenState] = useState<string | null>(() => readStoredToken())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(readStoredToken()))

  const clearSession = useCallback(() => {
    setTokenState(null)
    setUser(null)
    setCompany(null)
    setAuthToken(null)
    persistToken(null)
  }, [])

  const applySession = useCallback(
    (nextToken: string, nextUser: AuthUser, nextCompany: Company) => {
      setTokenState(nextToken)
      setUser(nextUser)
      setCompany(nextCompany)
      setAuthToken(nextToken)
      persistToken(nextToken)
    },
    [],
  )

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      navigate(routes.login, { replace: true })
    })
    return () => setUnauthorizedHandler(null)
  }, [clearSession, navigate])

  useEffect(() => {
    const stored = readStoredToken()
    if (!stored) {
      setIsLoading(false)
      return
    }

    setAuthToken(stored)
    let cancelled = false

    void getAuthMe()
      .then((me) => {
        if (cancelled) {
          return
        }
        applySession(stored, me.user, me.company)
      })
      .catch(() => {
        if (cancelled) {
          return
        }
        clearSession()
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [applySession, clearSession])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const session = await loginRequest(payload)
      applySession(session.access_token, session.user, session.company)
    },
    [applySession],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const session = await registerRequest(payload)
      applySession(session.access_token, session.user, session.company)
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // Client-side logout still proceeds if the network call fails.
    }
    clearSession()
    navigate(routes.login, { replace: true })
  }, [clearSession, navigate])

  const setCompanyState = useCallback((next: Company) => {
    setCompany(next)
  }, [])

  const value = useMemo(
    () => ({
      user,
      company,
      token,
      isAuthenticated: Boolean(token && user && company),
      isLoading,
      login,
      register,
      logout,
      setCompany: setCompanyState,
    }),
    [user, company, token, isLoading, login, register, logout, setCompanyState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
