import { z } from "zod"

export const reviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Please select a rating")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .trim()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be at most 500 characters"),
})

export type ReviewInput = z.infer<typeof reviewSchema>
