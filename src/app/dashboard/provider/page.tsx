"use client"

import {
  Package,
  CalendarClock,
  Timer,
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
import { useProviderGear } from "@/lib/hooks/use-gear"
import { useProviderOrders } from "@/lib/hooks/use-provider-orders"

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
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <CardTitle className="mt-2">{label}</CardTitle>
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
          <p className="font-display text-3xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function ProviderDashboardPage() {
  const { user } = useAuth()
  const gear = useProviderGear(user?.id ?? "", { limit: 1 })
  const orders = useProviderOrders({ limit: 100 })

  const orderItems = orders.data?.items ?? []
  const activeRentals = orderItems.filter(
    (order) =>
      order.orderStatus === "PAID" || order.orderStatus === "PICKED_UP"
  ).length
  const pendingOrders = orderItems.filter(
    (order) => order.orderStatus === "CONFIRMED"
  ).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">
          Welcome{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your gear listings and rental business
        </p>
      </div>

      <Separator className="mb-8" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Package}
          label="Total gear listed"
          description="Your rental inventory"
          value={gear.data?.meta.total ?? 0}
          isLoading={gear.isLoading}
          hasError={!!gear.error}
        />
        <StatCard
          icon={CalendarClock}
          label="Active rentals"
          description="Paid or picked-up orders"
          value={activeRentals}
          isLoading={orders.isLoading}
          hasError={!!orders.error}
        />
        <StatCard
          icon={Timer}
          label="Pending orders"
          description="Awaiting payment"
          value={pendingOrders}
          isLoading={orders.isLoading}
          hasError={!!orders.error}
        />
      </div>
    </div>
  )
}
