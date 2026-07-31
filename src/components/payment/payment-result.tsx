"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CircleCheckIcon, ClockIcon, OctagonXIcon, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { apiClient, ApiError } from "@/lib/api-client"
import { formatCurrency } from "@/lib/utils"
import type { PaymentSessionStatus } from "@/types"

export function PaymentResult({ mode }: { mode: "success" | "cancel" }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const orderIdParam = searchParams.get("order_id")

  const [data, setData] = useState<PaymentSessionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(mode !== "cancel")
  const [error, setError] = useState<string | null>(null)
  const fetched = useRef(false)

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setError("Missing session ID.")
      setIsLoading(false)
      return
    }

    try {
      const result = await apiClient.get<PaymentSessionStatus>(
        `/api/payments/success?session_id=${encodeURIComponent(sessionId)}`
      )
      if (result) {
        setData(result)
      } else {
        setError("No data returned.")
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.payload.message)
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (mode === "cancel") return
    if (fetched.current) return
    fetched.current = true
    fetchSession()
  }, [mode, fetchSession])

  function handleViewOrder() {
    const orderId = data?.orderId ?? orderIdParam
    if (orderId) {
      router.push(`/dashboard/customer/orders/${orderId}`)
    }
  }

  const isPending = data?.status === "PENDING"
  const isSuccess = data?.status === "SUCCESS"
  const isFailed = data?.status === "FAILED"

  if (mode === "cancel") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <OctagonXIcon className="size-6 text-destructive" />
          </div>
          <h1 className="font-display text-xl font-semibold">Payment cancelled</h1>
          <p className="text-sm text-muted-foreground">
            Your payment was not completed. No charges were made. You can retry payment or return
            to your dashboard.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {orderIdParam && (
              <Button
                variant="accent"
                onClick={() => router.push(`/dashboard/customer/orders/${orderIdParam}/pay`)}
              >
                Retry payment
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/customer")}
            >
              <LayoutDashboard className="size-4" />
              Go to dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      {isLoading && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying payment…</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 text-center">
          <OctagonXIcon className="size-12 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="accent" onClick={fetchSession}>
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/customer")}
            >
              <LayoutDashboard className="size-4" />
              Go to dashboard
            </Button>
          </div>
        </div>
      )}

      {data && !isLoading && (
        <Dialog
          open
          onOpenChange={(nextOpen) => {
            if (!nextOpen) router.push("/gear")
          }}
        >
          <DialogContent showCloseButton={false} className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                {isPending && <ClockIcon className="size-6 text-amber-500" />}
                {isSuccess && <CircleCheckIcon className="size-6 text-emerald-500" />}
                {isFailed && <OctagonXIcon className="size-6 text-destructive" />}
                <DialogTitle>
                  {isPending && "Payment pending"}
                  {isSuccess && "Payment successful"}
                  {isFailed && "Payment failed"}
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{data.status.toLowerCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(data.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="max-w-[180px] truncate font-mono text-xs">{data.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="max-w-[180px] truncate font-mono text-xs">{data.paymentId}</span>
              </div>
              {data.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid at</span>
                  <span className="font-medium">{new Date(data.paidAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {isPending && (
              <p className="text-center text-xs text-muted-foreground">
                Your payment is being processed. The order status will update once confirmed.
              </p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => router.push("/gear")}>
                Browse gear
              </Button>
              <Button variant="accent" onClick={handleViewOrder}>
                View order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
