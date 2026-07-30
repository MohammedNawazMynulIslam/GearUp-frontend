"use client"

import { SearchX } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { GearCard } from "@/components/gear/gear-card"
import type { Gear } from "@/types"

interface GearGridProps {
  items?: Gear[]
  isLoading?: boolean
  isEmpty?: boolean
  variant?: "public" | "provider"
  onDelete?: (id: string) => void
}

const SKELETON_COUNT = 6

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 px-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-4 w-1/5" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

export function GearGrid({
  items,
  isLoading = false,
  isEmpty = false,
  variant = "public",
  onDelete,
}: GearGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (isEmpty || !items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX className="mb-4 size-12 text-muted-foreground/50" />
        <p className="text-base font-medium text-foreground">No gear found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((gear) => (
        <GearCard key={gear.id} gear={gear} variant={variant} onDelete={onDelete} />
      ))}
    </div>
  )
}
