import type { Metadata } from "next"
import { Suspense } from "react"
import { PaymentResult } from "@/components/payment/payment-result"

export const metadata: Metadata = {
  title: "Payment cancelled | GearUp",
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <PaymentResult mode="cancel" />
    </Suspense>
  )
}
