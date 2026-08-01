"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
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
import { ReviewForm } from "@/components/reviews/review-form"
import { useRentals } from "@/lib/hooks/use-rentals"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { OrderStatus, RentalOrder } from "@/types"

function nextActionForStatus(
  status: OrderStatus,
  orderId: string
): { label: string; href: string; variant: "accent" } | null {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Pay Now",
        href: `/dashboard/customer/orders/${orderId}/pay`,
        variant: "accent",
      }
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
            <Skeleton className="h-3.5 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="ml-auto h-7 w-20 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function CustomerOrdersPage() {
  const [page, setPage] = useState(1)
  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null)
  const { data, isLoading, error, refetch } = useRentals({ page, limit: 10 })
  const orders = data?.items ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your rental orders and their current status
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load your orders. Please try again.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="overflow-hidden rounded-lg border">
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
              <SkeletonRows />
            </TableBody>
          </Table>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Package className="size-12 text-muted-foreground/50" />
          <p className="text-base font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            When you rent gear, your orders will show up here.
          </p>
          <Button
            variant="accent"
            size="sm"
            className="mt-2"
            nativeButton={false}
            render={<Link href="/gear" />}
          >
            Browse gear
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
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
              {orders.map((order) => {
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
                      {formatCurrency(order.totalAmount * 100)}
                    </TableCell>
                    <TableCell>
                      <RentalStatusBadge status={order.orderStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      {order.orderStatus === "RETURNED" ? (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setReviewOrder(order)}
                        >
                          Leave Review
                        </Button>
                      ) : action ? (
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

      <ReviewForm
        key={reviewOrder?.id ?? "closed"}
        open={!!reviewOrder}
        onOpenChange={(open) => {
          if (!open) setReviewOrder(null)
        }}
        items={
          reviewOrder?.items?.map((item) => ({
            gearId: item.gearId,
            title: item.gear?.title ?? item.gearId,
          })) ?? []
        }
      />
    </div>
  )
}
