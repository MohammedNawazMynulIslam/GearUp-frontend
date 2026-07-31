import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { OrderStatus, PaginatedResponse, RentalOrder } from "@/types"

export interface ProviderOrderListParams {
  page?: number
  limit?: number
}

function buildQueryString(params: ProviderOrderListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function useProviderOrders(params: ProviderOrderListParams = {}) {
  return useQuery({
    queryKey: ["provider-orders", params],
    queryFn: (): Promise<PaginatedResponse<RentalOrder> | null> =>
      apiClient.getPaginated<RentalOrder>(
        `/api/provider/orders${buildQueryString(params)}`
      ),
  })
}

export function useUpdateProviderOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: {
      orderId: string
      orderStatus: OrderStatus
    }) =>
      apiClient.patch<RentalOrder>(`/api/provider/orders/${orderId}`, {
        orderStatus,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] })
    },
  })
}
