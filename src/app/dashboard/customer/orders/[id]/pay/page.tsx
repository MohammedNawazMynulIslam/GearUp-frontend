"use client"

import { useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Loader2, OctagonXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInitiatePayment } from "@/lib/hooks/use-payment-mutations"
import { ApiError } from "@/lib/api-client"

export default function PayPage() {
  const params = useParams<{ id: string }>()
  const orderId = params.id
  const initiatePayment = useInitiatePayment()
  const initiated = useRef(false)

  useEffect(() => {
    if (initiated.current || !orderId) return
    initiated.current = true

    async function pay() {
      try {
        const result = await initiatePayment.mutateAsync({ orderId, currency: "BDT" })
        if (result?.url) {
          window.location.href = result.url
        }
      } catch {
        // error is handled via isError below
      }
    }

    pay()
  }, [orderId, initiatePayment])

  if (initiatePayment.isError) {
    const message =
      initiatePayment.error instanceof ApiError
        ? initiatePayment.error.payload.message
        : "Failed to initiate payment. Please try again."

    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <OctagonXIcon className="size-12 text-destructive" />
        <h1 className="font-display text-xl font-semibold">Payment failed</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button
          variant="accent"
          onClick={() => {
            initiated.current = false
            initiatePayment.reset()
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <Loader2 className="size-10 animate-spin text-primary" />
      <h1 className="font-display text-xl font-semibold">
        Redirecting to payment…
      </h1>
      <p className="text-sm text-muted-foreground">
        Please wait while we take you to the secure checkout page.
      </p>
    </div>
  )
}
