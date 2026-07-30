"use client"

import Link from "next/link"
import { ArrowRight, Tent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GearGrid } from "@/components/gear/gear-grid"
import { useGearList } from "@/lib/hooks/use-gear"

export default function HomePage() {
  const { data, isLoading } = useGearList({ limit: 8, page: 1 })

  const items = data?.items ?? []
  const isEmpty = !isLoading && items.length === 0

  return (
    <>
      <section className="contour-bg flex flex-col items-center justify-center bg-primary px-4 py-24 text-center text-primary-foreground sm:py-32">
        <Tent className="mb-6 size-12 opacity-80" aria-hidden="true" />
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Gear Up for Your Next Adventure
        </h1>
        <p className="mt-4 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
          Rent premium outdoor equipment from local providers. Save money, reduce waste, and explore with confidence.
        </p>
        <Button
          variant="accent"
          size="lg"
          className="mt-8"
          nativeButton={false}
          render={<Link href="/gear" />}
        >
          Browse gear
          <ArrowRight className="size-4" />
        </Button>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground">Featured gear</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover popular equipment ready for your next trip.
          </p>
        </div>
        <GearGrid items={items} isLoading={isLoading} isEmpty={isEmpty} />
      </section>
    </>
  )
}
