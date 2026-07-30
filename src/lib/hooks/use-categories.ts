import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Category } from "@/types"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: (): Promise<Category[] | null> => apiClient.get<Category[]>("/api/categories"),
    staleTime: 5 * 60 * 1000,
  })
}
