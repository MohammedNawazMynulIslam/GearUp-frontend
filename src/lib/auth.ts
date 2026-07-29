import Cookies from "js-cookie"
import { decodeToken } from "./jwt"
import type { Role } from "@/types"

const TOKEN_KEY = "gearup-token"
const REFRESH_TOKEN_KEY = "gearup-refresh-token"

export function setAuthToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  })
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY)
}

export function setRefreshToken(token: string): void {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  })
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function clearAuthToken(): void {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}

export function getCurrentUser() {
  const token = getAuthToken()
  if (!token) return null
  return decodeToken(token)
}

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin"
    case "PROVIDER":
      return "/dashboard/provider"
    case "CUSTOMER":
      return "/dashboard/customer"
  }
}
