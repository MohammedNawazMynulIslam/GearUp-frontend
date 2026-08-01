"use client"

import {
  Users,
  Package,
  ReceiptText,
  AlertCircle,
  type LucideIcon,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/providers/auth-provider"
import { useAdminUsers } from "@/lib/hooks/use-admin-users"
import { useAdminGear } from "@/lib/hooks/use-admin-gear"
import { useAdminRentals } from "@/lib/hooks/use-admin-rentals"

interface StatCardProps {
  icon: LucideIcon
  label: string
  description: string
  value: number
  isLoading: boolean
  hasError: boolean
}

function StatCard({
  icon: Icon,
  label,
  description,
  value,
  isLoading,
  hasError,
}: StatCardProps) {
  return (
    <Card className="rounded-lg border-border/80 shadow-sm shadow-black/[0.03]">
      <CardHeader>
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Icon className="size-5 text-primary-foreground" />
        </div>
        <CardTitle className="mt-2 text-lg">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-16" />
        ) : hasError ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <AlertCircle className="size-4" />
            Unavailable
          </div>
        ) : (
          <p className="font-display text-4xl font-bold tracking-tight">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const users = useAdminUsers({ limit: 1 })
  const gear = useAdminGear({ limit: 1, isAvailable: "true" })
  const rentals = useAdminRentals({ limit: 1 })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm shadow-black/[0.03]">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Admin{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Platform overview and moderation tools
        </p>
      </div>

      <Separator className="mb-8 hidden" />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total users"
          description="Registered accounts"
          value={users.data?.meta.total ?? 0}
          isLoading={users.isLoading}
          hasError={!!users.error}
        />
        <StatCard
          icon={Package}
          label="Active gear"
          description="Available listings"
          value={gear.data?.meta.total ?? 0}
          isLoading={gear.isLoading}
          hasError={!!gear.error}
        />
        <StatCard
          icon={ReceiptText}
          label="Total rentals"
          description="All rental orders"
          value={rentals.data?.meta.total ?? 0}
          isLoading={rentals.isLoading}
          hasError={!!rentals.error}
        />
      </div>
    </div>
  )
}
