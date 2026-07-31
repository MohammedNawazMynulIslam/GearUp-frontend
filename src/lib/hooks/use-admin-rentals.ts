import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { OrderStatus, PaginatedResponse, RentalOrder } from "@/types"

export interface AdminRentalListParams {
  page?: number
  limit?: number
  orderStatus?: OrderStatus
  customerId?: string
}

function buildQueryString(params: AdminRentalListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function useAdminRentals(params: AdminRentalListParams = {}) {
  return useQuery({
    queryKey: ["admin-rentals", params],
    queryFn: (): Promise<PaginatedResponse<RentalOrder> | null> =>
      apiClient.getPaginated<RentalOrder>(
        `/api/admin/rentals${buildQueryString(params)}`
      ),
  })
}
