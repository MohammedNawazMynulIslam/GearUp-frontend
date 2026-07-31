"use client"

import Link from "next/link"
import {
  Package,
  CreditCard,
  ReceiptText,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useRentals } from "@/lib/hooks/use-rentals"
import { usePayments } from "@/lib/hooks/use-payments"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { OrderStatus, PaymentStatus } from "@/types"

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
  REFUNDED: "Refunded",
}

function nextActionForStatus(
  status: OrderStatus,
  orderId: string
): { label: string; href: string; variant: "accent" | "outline" } | null {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Pay Now",
        href: `/dashboard/customer/orders/${orderId}/pay`,
        variant: "accent",
      }
    case "RETURNED":
      return {
        label: "Leave Review",
        href: `/dashboard/customer/orders/${orderId}/review`,
        variant: "outline",
      }
    default:
      return null
  }
}

export default function CustomerDashboardPage() {
  const { user } = useAuth()
  const rentals = useRentals()
  const payments = usePayments()

  const rentalsLoading = rentals.isLoading
  const rentalsError = rentals.error
  const rentalsList = rentals.data?.items ?? []

  const paymentsLoading = payments.isLoading
  const paymentsError = payments.error
  const paymentsList = payments.data?.items ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">
          My Dashboard{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your orders and payments
        </p>
      </div>

      <Separator className="mb-8" />

      <div className="space-y-8">
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <CardTitle>Order history</CardTitle>
              </div>
              <CardDescription>
                Your rental orders and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rentalsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                  ))}
                </div>
              ) : rentalsError ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <AlertCircle className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    Failed to load your orders.
                  </p>
                </div>
              ) : rentalsList.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <Package className="size-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No orders yet. When you rent gear, it will show up here.
                  </p>
                  <Button
                    variant="accent"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/gear" />}
                  >
                    Browse gear
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Next action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rentalsList.map((order) => {
                      const action = nextActionForStatus(order.orderStatus, order.id)
                      return (
                        <TableRow key={order.id}>
                          <TableCell>
                            <span className="font-mono text-xs">{order.id}</span>
                          </TableCell>
                          <TableCell>
                            {formatDate(order.startDate)} – {formatDate(order.endDate)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <RentalStatusBadge status={order.orderStatus} />
                          </TableCell>
                          <TableCell className="text-right">
                            {action ? (
                              <Button
                                variant={action.variant}
                                size="xs"
                                nativeButton={false}
                                render={<Link href={action.href} />}
                              >
                                {action.label}
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="size-5 text-primary" />
                <CardTitle>Payment history</CardTitle>
              </div>
              <CardDescription>
                All payments made for your rental orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                  ))}
                </div>
              ) : paymentsError ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <AlertCircle className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    Failed to load your payments.
                  </p>
                </div>
              ) : paymentsList.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <ReceiptText className="size-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No payments yet. Payments appear here once you pay for an order.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Paid at</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentsList.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <span className="font-mono text-xs">{payment.id}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs">{payment.orderId}</span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm capitalize">
                            {paymentStatusLabel[payment.status] ?? payment.status.toLowerCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm capitalize">
                          {payment.provider.toLowerCase()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
