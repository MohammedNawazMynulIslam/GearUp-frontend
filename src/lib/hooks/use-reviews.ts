import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { PaginatedResponse, Review } from "@/types"

export interface CreateReviewInput {
  gearId: string
  rating: number
  comment: string
}

export function useReviews(gearId: string) {
  return useQuery({
    queryKey: ["reviews", gearId],
    queryFn: (): Promise<PaginatedResponse<Review> | null> =>
      apiClient.getPaginated<Review>(`/api/reviews/${gearId}`),
    enabled: !!gearId,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReviewInput) =>
      apiClient.post<Review>("/api/reviews", data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] })
      queryClient.invalidateQueries({ queryKey: ["gear"] })
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.gearId] })
    },
  })
}
