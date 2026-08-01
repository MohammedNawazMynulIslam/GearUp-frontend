"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"
import { useAdminRentals } from "@/lib/hooks/use-admin-rentals"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { OrderStatus, PaymentStatus, RentalOrder } from "@/types"

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
  REFUNDED: "Refunded",
}

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "PLACED", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PAID", label: "Paid" },
  { value: "PICKED_UP", label: "Picked up" },
  { value: "RETURNED", label: "Returned" },
  { value: "CANCELLED", label: "Cancelled" },
]

function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-3.5 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-14" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function OrderItems({ order }: { order: RentalOrder }) {
  const items = order.items ?? []
  if (items.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      {items.map((item) => (
        <span key={item.id} className="truncate text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.quantity}×</span>{" "}
          {item.gear?.title ?? item.gearId}
        </span>
      ))}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1)
  const [orderStatus, setOrderStatus] = useState<OrderStatus | undefined>(undefined)

  const { data, isLoading, error, refetch } = useAdminRentals({
    page,
    limit: 10,
    orderStatus,
  })
  const orders = data?.items ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Read-only overview of all rental orders
          </p>
        </div>
        <Select
          value={orderStatus ?? ""}
          onValueChange={(value) => {
            setOrderStatus(value === "" ? undefined : (value as OrderStatus))
            setPage(1)
          }}
        >
          <SelectTrigger aria-label="Filter by order status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load orders. Please try again.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 size-12 text-muted-foreground/50" />
          <p className="text-base font-medium text-foreground">No orders found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {orderStatus
              ? "No orders match the selected status."
              : "Rental orders will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="font-mono text-xs">{order.id}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{order.customer?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.startDate)} – {formatDate(order.endDate)}
                  </TableCell>
                  <TableCell>
                    <OrderItems order={order} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(order.totalAmount * 100)}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <RentalStatusBadge status={order.orderStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {meta && meta.total > 0 && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <AlertCircle className="size-4" />
          {meta.total} order{meta.total === 1 ? "" : "s"} found
        </p>
      )}
    </div>
  )
}
