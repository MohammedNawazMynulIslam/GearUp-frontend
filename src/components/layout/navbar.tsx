"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Tent, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import { dashboardPathForRole } from "@/lib/auth"
import type { Role } from "@/types"

export default function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")

  const initial = user?.email?.charAt(0).toUpperCase() ?? "?"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-sm shadow-black/[0.02] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
          <Tent className="size-5" aria-hidden="true" />
          GearUp
        </Link>

        <nav className="flex min-w-0 items-center gap-1">
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/gear" />}>
            Browse gear
          </Button>
          {user && !isDashboard && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              nativeButton={false}
              render={<Link href={dashboardPathForRole(user.role as Role)} />}
            >
              Dashboard
            </Button>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-20 rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 text-sm transition-colors hover:bg-muted">
                <Avatar size="sm">
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user.email}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="truncate text-sm font-medium">{user.email}</p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(dashboardPathForRole(user.role as Role))}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/auth/login" />}>
                Log in
              </Button>
              <Button variant="default" size="sm" nativeButton={false} render={<Link href="/auth/register" />}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
