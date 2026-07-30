import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Gear } from "@/types"

export interface CreateGearInput {
  title: string
  description: string
  brand: string
  categoryId: string
  pricePerDay: number
  stock: number
  images: string[]
  specifications?: string | null
  isAvailable: boolean
}

export function useCreateGear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGearInput) =>
      apiClient.post<Gear>("/api/provider/gear", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gear"] })
    },
  })
}

export function useUpdateGear(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<CreateGearInput>) =>
      apiClient.patch<Gear>(`/api/provider/gear/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gear"] })
    },
  })
}

export function useDeleteGear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/provider/gear/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gear"] })
    },
  })
}
