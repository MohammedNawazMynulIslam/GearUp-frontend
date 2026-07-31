import { z } from "zod"

export const gearSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  pricePerDay: z.coerce.number().min(0.01, "Price must be at least $0.01"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  images: z.string().min(1, "At least one image URL is required"),
  specifications: z.string().optional(),
  isAvailable: z.boolean(),
})

export type GearFormValues = z.infer<typeof gearSchema>
