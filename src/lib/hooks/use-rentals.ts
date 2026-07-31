import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { PaginatedResponse, RentalOrder } from "@/types"

export interface RentalListParams {
  page?: number
  limit?: number
}

function buildQueryString(params: RentalListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function useRentals(params: RentalListParams = {}) {
  return useQuery({
    queryKey: ["rentals", params],
    queryFn: (): Promise<PaginatedResponse<RentalOrder> | null> =>
      apiClient.getPaginated<RentalOrder>(`/api/rentals${buildQueryString(params)}`),
  })
}

export function useRental(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: (): Promise<RentalOrder | null> => apiClient.get<RentalOrder>(`/api/rentals/${id}`),
    enabled: !!id,
  })
}
