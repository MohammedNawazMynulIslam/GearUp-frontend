import { jwtDecode } from "jwt-decode"

export interface JwtPayload {
  id: string
  role: string
  email: string
  iat: number
  exp: number
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded) return true
  return decoded.exp * 1000 < Date.now()
}
