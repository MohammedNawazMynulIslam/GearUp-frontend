import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { PaginatedResponse, Payment } from "@/types"

export interface PaymentListParams {
  page?: number
  limit?: number
}

function buildQueryString(params: PaymentListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function usePayments(params: PaymentListParams = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: (): Promise<PaginatedResponse<Payment> | null> =>
      apiClient.getPaginated<Payment>(`/api/payments${buildQueryString(params)}`),
  })
}
