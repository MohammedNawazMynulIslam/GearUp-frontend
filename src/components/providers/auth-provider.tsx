"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { useRouter } from "next/navigation"
import { clearAuthToken, getCurrentUser } from "@/lib/auth"
import type { JwtPayload } from "@/lib/jwt"

interface AuthContextValue {
  user: JwtPayload | null
  isLoading: boolean
  refresh: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refresh = useCallback(() => {
    setUser(getCurrentUser())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      refresh()
    }, 0)
    return () => clearTimeout(id)
  }, [refresh])

  const logout = useCallback(() => {
    clearAuthToken()
    setUser(null)
    router.push("/auth/login")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isLoading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
