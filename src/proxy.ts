import { NextRequest, NextResponse } from "next/server"
import { decodeToken, isTokenExpired } from "@/lib/jwt"

const TOKEN_KEY = "gearup-token"

const publicPaths = ["/auth/login", "/auth/register"]

const pathRoleMap: Record<string, string> = {
  "/dashboard/customer": "CUSTOMER",
  "/dashboard/provider": "PROVIDER",
  "/dashboard/admin": "ADMIN",
}

const roleDashboards: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get(TOKEN_KEY)?.value

  let user: ReturnType<typeof decodeToken> = null
  if (token && !isTokenExpired(token)) {
    user = decodeToken(token)
  }

  const isAuthenticated = user !== null
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p))
  const isDashboardPath = Object.keys(pathRoleMap).some((p) =>
    pathname.startsWith(p)
  )

  if (isAuthenticated && isPublicPath) {
    const dashboard = roleDashboards[user!.role]
    if (dashboard) {
      return NextResponse.redirect(new URL(dashboard, request.url))
    }
  }

  if (!isAuthenticated && isDashboardPath) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && isDashboardPath) {
    const requiredRole = Object.entries(pathRoleMap).find(([path]) =>
      pathname.startsWith(path)
    )?.[1]

    if (requiredRole && user!.role !== requiredRole) {
      const dashboard = roleDashboards[user!.role]
      if (dashboard) {
        return NextResponse.redirect(new URL(dashboard, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
}
