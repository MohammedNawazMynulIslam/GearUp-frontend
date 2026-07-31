import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { CreatePaymentResponse } from "@/types"

export interface InitiatePaymentInput {
  orderId: string
  currency?: string
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (data: InitiatePaymentInput) =>
      apiClient.post<CreatePaymentResponse>("/api/payments/create", data),
  })
}
