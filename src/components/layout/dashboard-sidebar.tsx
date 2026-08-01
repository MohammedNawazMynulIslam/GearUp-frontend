"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Tent,
  LayoutDashboard,
  Users,
  Package,
  ReceiptText,
  Tags,
  ShoppingBag,
  CreditCard,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"
import type { Role } from "@/types"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

interface SidebarSection {
  label?: string
  items: NavItem[]
}

const roleSections: Record<Role, SidebarSection[]> = {
  ADMIN: [
    {
      items: [
        {
          href: "/dashboard/admin",
          label: "Overview",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      label: "Moderation",
      items: [
        { href: "/dashboard/admin/users", label: "Users", icon: Users },
        { href: "/dashboard/admin/gear", label: "Gear", icon: Package },
        { href: "/dashboard/admin/orders", label: "Orders", icon: ReceiptText },
      ],
    },
    {
      label: "Catalog",
      items: [
        { href: "/dashboard/admin/categories", label: "Categories", icon: Tags },
      ],
    },
  ],
  PROVIDER: [
    {
      items: [
        {
          href: "/dashboard/provider",
          label: "Overview",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      items: [
        { href: "/dashboard/provider/gear", label: "My Gear", icon: Package },
        { href: "/dashboard/provider/orders", label: "Orders", icon: ReceiptText },
      ],
    },
  ],
  CUSTOMER: [
    {
      items: [
        {
          href: "/dashboard/customer",
          label: "Overview",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      items: [
        { href: "/dashboard/customer/orders", label: "Orders", icon: ShoppingBag },
        { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
      ],
    },
  ],
}

function SidebarContent({
  onNavigate,
  showCloseButton,
}: {
  onNavigate?: () => void
  showCloseButton?: boolean
}) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const role = (user?.role as Role | undefined) ?? "CUSTOMER"
  const sections = roleSections[role] ?? []
  const initial = user?.email?.charAt(0).toUpperCase() ?? "?"

  function isActive(item: NavItem): boolean {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 font-display text-lg font-semibold text-primary"
        >
          <Tent className="size-5" aria-hidden="true" />
          GearUp
        </Link>
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto"
            onClick={onNavigate}
            aria-label="Close menu"
          >
            <X />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section, index) => (
          <div key={index} className={cn(index > 0 && "mt-5")}>
            {section.label && (
              <p className="px-3 pb-2 text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2.5 px-1.5">
          <Avatar size="sm">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.email ?? "Signed out"}</p>
            <p className="text-xs text-muted-foreground">
              {user ? role.toLowerCase() : "Guest"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-14 z-30 flex h-12 items-center gap-2 border-b border-border bg-background px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu />
        </Button>
        <span className="font-display text-sm font-semibold">Dashboard</span>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-background shadow-xl transition-transform duration-200 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar"
      >
        <SidebarContent onNavigate={() => setOpen(false)} showCloseButton />
      </aside>

      <aside className="fixed top-14 bottom-0 left-0 z-20 hidden w-64 border-r border-border bg-background lg:block">
        <SidebarContent />
      </aside>
    </>
  )
}
