import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { RentalOrder } from "@/types"

export interface CreateRentalInput {
  startDate: string
  endDate: string
  pickupAddress: string
  items: Array<{ gearId: string; quantity: number }>
}

export function useCreateRental() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRentalInput) =>
      apiClient.post<RentalOrder>("/api/rentals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] })
    },
  })
}
