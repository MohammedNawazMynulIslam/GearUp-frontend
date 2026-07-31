import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Gear, PaginatedResponse } from "@/types"

export interface GearListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  availableFrom?: string
  availableTo?: string
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

async function fetchAllGearForProvider(providerId: string): Promise<Gear[] | null> {
  const pageSize = 100
  let page = 1
  let totalPage = 1
  const items: Gear[] = []

  while (page <= totalPage) {
    const res = await apiClient.getPaginated<Gear>(
      `/api/gear?page=${page}&limit=${pageSize}`
    )
    if (!res) return null
    items.push(...res.items.filter((gear) => gear.providerId === providerId))
    totalPage = res.meta.totalPage
    page += 1
  }

  return items
}

export function useProviderGear(providerId: string, params: GearListParams = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 12

  return useQuery({
    queryKey: ["gear", "provider", providerId, params],
    queryFn: async (): Promise<PaginatedResponse<Gear> | null> => {
      const all = await fetchAllGearForProvider(providerId)
      if (!all) return null
      const total = all.length
      const totalPage = total === 0 ? 0 : Math.ceil(total / limit)
      const start = (page - 1) * limit
      return {
        items: all.slice(start, start + limit),
        meta: { page, limit, total, totalPage },
      }
    },
    enabled: !!providerId,
  })
}

export { useCategories } from "@/lib/hooks/use-categories"
