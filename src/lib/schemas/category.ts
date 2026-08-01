import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().trim().optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
