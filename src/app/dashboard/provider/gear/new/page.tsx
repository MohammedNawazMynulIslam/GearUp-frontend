"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { GearForm, type GearFormValues } from "@/components/gear/gear-form"
import { useCreateGear } from "@/lib/hooks/use-gear-mutations"
import { toast } from "sonner"
import { ApiError } from "@/lib/api-client"
import { Button } from "@/components/ui/button"

export default function NewGearPage() {
  const router = useRouter()
  const createMutation = useCreateGear()

  async function onSubmit(data: GearFormValues) {
    try {
      const images = data.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      await createMutation.mutateAsync({
        title: data.title,
        description: data.description,
        brand: data.brand,
        categoryId: data.categoryId,
        pricePerDay: data.pricePerDay,
        stock: data.stock,
        images,
        specifications: data.specifications || null,
        isAvailable: data.isAvailable,
      })
      toast.success("Gear created successfully")
      router.push("/dashboard/provider/gear")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error("Failed to create gear")
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" nativeButton={false} render={<Link href="/dashboard/provider/gear" />}>
          <ChevronLeft className="size-4" />
          Back to gear
        </Button>

        <h1 className="font-display text-3xl font-bold tracking-tight">Add new gear</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Create a polished listing with pricing, availability, images, and useful specs.
        </p>
      </div>

      <GearForm
        onSubmit={onSubmit}
        isPending={createMutation.isPending}
        submitLabel="Create gear"
      />
    </div>
  )
}
