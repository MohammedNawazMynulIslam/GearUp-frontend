import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Gear, Category, PaginatedResponse } from "@/types"

export interface GearListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  sortOrder?: string
}

function buildQueryString(params: GearListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function useGearList(params: GearListParams = {}) {
  return useQuery({
    queryKey: ["gear", "list", params],
    queryFn: (): Promise<PaginatedResponse<Gear> | null> =>
      apiClient.getPaginated<Gear>(`/api/gear${buildQueryString(params)}`),
  })
}

export function useGearDetail(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: (): Promise<Gear | null> => apiClient.get<Gear>(`/api/gear/${id}`),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: (): Promise<Category[] | null> => apiClient.get<Category[]>("/api/categories"),
    staleTime: 5 * 60 * 1000,
  })
}
