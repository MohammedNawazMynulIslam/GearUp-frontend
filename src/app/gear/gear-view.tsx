"use client"

import { useCallback, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GearFilters } from "@/components/gear/gear-filters"
import { GearGrid } from "@/components/gear/gear-grid"
import { useGearList } from "@/lib/hooks/use-gear"

export function GearView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const page = Number(searchParams.get("page")) || 1

  const params = {
    page,
    category: searchParams.get("category") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    availableFrom: searchParams.get("availableFrom") ?? undefined,
    availableTo: searchParams.get("availableTo") ?? undefined,
  }

  const goToPage = useCallback(
    (p: number) => {
      const next = new URLSearchParams(searchParams.toString())
      next.set("page", String(p))
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams]
  )

  const { data, isLoading, error, refetch } = useGearList(params)
  const gears = data?.items ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Browse Gear</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find the perfect gear for your next adventure
        </p>
      </div>

      <GearFilters />

      {error ? (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load gear. Please try again.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <GearGrid items={gears} isLoading={isLoading} />
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPage}
            onClick={() => goToPage(page + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
