"use client"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { GearForm, type GearFormValues } from "@/components/gear/gear-form"
import { useGearDetail } from "@/lib/hooks/use-gear"
import { useUpdateGear } from "@/lib/hooks/use-gear-mutations"
import { toast } from "sonner"
import { ApiError } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditGearPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { data: gear, isLoading } = useGearDetail(id)
  const updateMutation = useUpdateGear(id)

  async function onSubmit(data: GearFormValues) {
    try {
      const images = data.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      await updateMutation.mutateAsync({
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
      toast.success("Gear updated successfully")
      router.push("/dashboard/provider/gear")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error("Failed to update gear")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Skeleton className="mb-4 h-8 w-32" />
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!gear) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Gear not found</p>
        <Button variant="outline" size="sm" className="mt-4" nativeButton={false} render={<Link href="/dashboard/provider/gear" />}>
          Back to gear
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" nativeButton={false} render={<Link href="/dashboard/provider/gear" />}>
          <ChevronLeft className="size-4" />
          Back to gear
        </Button>

        <h1 className="font-display text-3xl font-bold tracking-tight">Edit gear</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Keep your listing details, availability, and rental information accurate.
        </p>
      </div>

      <GearForm
        defaultValues={{
          title: gear.title,
          description: gear.description,
          brand: gear.brand,
          categoryId: gear.categoryId,
          pricePerDay: gear.pricePerDay,
          stock: gear.stock,
          images: gear.images.join(", "),
          specifications: gear.specifications ?? undefined,
          isAvailable: gear.isAvailable,
        }}
        onSubmit={onSubmit}
        isPending={updateMutation.isPending}
        submitLabel="Update"
      />
    </div>
  )
}
