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
import { useRentals } from "@/lib/hooks/use-rentals"

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

export default function CustomerDashboardPage() {
  const { user } = useAuth()
  const rentals = useRentals({ limit: 100 })

  const rentalsLoading = rentals.isLoading
  const rentalsError = rentals.error
  const rentalsList = rentals.data?.items ?? []

  const activeRentals = rentalsList.filter(
    (order) =>
      order.orderStatus === "PAID" || order.orderStatus === "PICKED_UP"
  ).length
  const pendingOrders = rentalsList.filter(
    (order) => order.orderStatus === "CONFIRMED"
  ).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">
          My Dashboard{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your orders and payments
        </p>
      </div>

      <Separator className="mb-8" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Package}
          label="Total orders"
          description="All your rental orders"
          value={rentals.data?.meta.total ?? 0}
          isLoading={rentalsLoading}
          hasError={!!rentalsError}
        />
        <StatCard
          icon={CalendarClock}
          label="Active rentals"
          description="Paid or picked-up orders"
          value={activeRentals}
          isLoading={rentalsLoading}
          hasError={!!rentalsError}
        />
        <StatCard
          icon={Timer}
          label="Awaiting payment"
          description="Orders ready to pay"
          value={pendingOrders}
          isLoading={rentalsLoading}
          hasError={!!rentalsError}
        />
      </div>
    </div>
  )
}
