"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ChevronLeft,
  AlertCircle,
  Package,
  MapPin,
  StickyNote,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"
import { useRental } from "@/lib/hooks/use-rentals"
import { ApiError } from "@/lib/api-client"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { PaymentStatus } from "@/types"

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
  REFUNDED: "Refunded",
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{children}</dd>
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const orderId = params.id
  const { data: order, isLoading, error, refetch } = useRental(orderId)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    const message =
      error instanceof ApiError
        ? error.payload.message
        : "Failed to load your order. Please try again."
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-20 text-center">
        <AlertCircle className="size-12 text-destructive" />
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button variant="accent" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!order) return null

  const items = order.items ?? []
  const needsPayment = order.orderStatus === "CONFIRMED"
  const discount = order.discount ?? 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/customer/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Order details</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{order.id}</p>
        </div>
        <RentalStatusBadge status={order.orderStatus} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <CardTitle>Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <DetailRow label="Rental period">
                {formatDate(order.startDate)} – {formatDate(order.endDate)}
                {" · "}
                {order.totalDays} day{order.totalDays === 1 ? "" : "s"}
              </DetailRow>
              {order.pickupAddress && (
                <DetailRow label="Pickup address">
                  <span className="inline-flex items-center gap-1.5 text-right">
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    {order.pickupAddress}
                  </span>
                </DetailRow>
              )}
              {order.notes && (
                <DetailRow label="Notes">
                  <span className="inline-flex items-start gap-1.5 text-right">
                    <StickyNote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    {order.notes}
                  </span>
                </DetailRow>
              )}
              <DetailRow label="Subtotal">{formatCurrency(order.subtotal * 100)}</DetailRow>
              {discount > 0 && (
                <DetailRow label="Discount">−{formatCurrency(discount * 100)}</DetailRow>
              )}
              <DetailRow label="Total">
                <span className="text-base font-semibold">
                  {formatCurrency(order.totalAmount * 100)}
                </span>
              </DetailRow>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-primary" />
              <CardTitle>Payment</CardTitle>
            </div>
            <CardDescription>Payment status for this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm capitalize text-muted-foreground">
                {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus.toLowerCase()}
              </span>
              {needsPayment && (
                <Button
                  variant="accent"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/dashboard/customer/orders/${order.id}/pay`} />}
                >
                  Pay Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <CardTitle>Items</CardTitle>
            </div>
            <CardDescription>Gear included in this rental</CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items on this order.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gear</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate / day</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.gear?.title ?? item.gearId}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.gear?.brand ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.pricePerDay * 100)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.pricePerDay * item.quantity * order.totalDays * 100)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
