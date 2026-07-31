import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Gear, PaginatedResponse } from "@/types"

export interface AdminGearListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  brand?: string
  providerId?: string
  isAvailable?: string
}

function buildQueryString(params: AdminGearListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function useAdminGear(params: AdminGearListParams = {}) {
  return useQuery({
    queryKey: ["admin-gear", params],
    queryFn: (): Promise<PaginatedResponse<Gear> | null> =>
      apiClient.getPaginated<Gear>(`/api/admin/gear${buildQueryString(params)}`),
  })
}
