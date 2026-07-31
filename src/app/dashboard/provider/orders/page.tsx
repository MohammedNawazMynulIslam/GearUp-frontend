"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Package, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useProviderOrders, useUpdateProviderOrder } from "@/lib/hooks/use-provider-orders"
import { toast } from "sonner"
import { ApiError } from "@/lib/api-client"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { OrderStatus, RentalOrder } from "@/types"

interface OrderAction {
  next: OrderStatus
  label: string
  variant: "default" | "accent"
}

function actionForStatus(status: OrderStatus): OrderAction | null {
  switch (status) {
    case "PLACED":
      return { next: "CONFIRMED", label: "Confirm", variant: "default" }
    case "PAID":
      return { next: "PICKED_UP", label: "Mark Picked Up", variant: "default" }
    case "PICKED_UP":
      return { next: "RETURNED", label: "Mark Returned", variant: "accent" }
    default:
      return null
  }
}

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
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="ml-auto h-7 w-28 rounded-md" />
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

export default function ProviderOrdersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error, refetch } = useProviderOrders({
    page,
    limit: 10,
  })
  const updateMutation = useUpdateProviderOrder()
  const orders = data?.items ?? []
  const meta = data?.meta
  const pendingOrderId = updateMutation.variables?.orderId

  async function handleAction(order: RentalOrder, action: OrderAction) {
    try {
      await updateMutation.mutateAsync({ orderId: order.id, orderStatus: action.next })
      toast.success("Order updated")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error("Failed to update order")
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/provider"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to dashboard
      </Link>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage incoming rental orders for your gear
        </p>
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 size-12 text-muted-foreground/50" />
          <p className="text-base font-medium text-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Rental orders for your gear will appear here.
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const action = actionForStatus(order.orderStatus)
                const isPending = pendingOrderId === order.id && updateMutation.isPending
                return (
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
                    <TableCell>
                      <RentalStatusBadge status={order.orderStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      {action ? (
                        <Button
                          variant={action.variant}
                          size="xs"
                          onClick={() => handleAction(order, action)}
                          disabled={isPending}
                        >
                          {isPending ? "Updating…" : action.label}
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
          {meta.total} order{meta.total === 1 ? "" : "s"} in total
        </p>
      )}
    </div>
  )
}
