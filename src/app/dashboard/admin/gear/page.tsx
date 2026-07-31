"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  ImageIcon,
  Star,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { useAdminGear } from "@/lib/hooks/use-admin-gear"
import { cn, formatCurrency } from "@/lib/utils"
import type { Gear } from "@/types"

function GearThumb({ gear }: { gear: Gear }) {
  const [imgError, setImgError] = useState(false)
  const imageSrc = gear.images?.[0]

  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
      {imageSrc && !imgError ? (
        <Image
          src={imageSrc}
          alt={gear.title}
          fill
          className="object-cover"
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="size-4 text-muted-foreground/40" />
        </div>
      )}
    </div>
  )
}

function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-14" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-14" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function AdminGearPage() {
  const [page, setPage] = useState(1)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(input.trim())
      setPage(1)
    }, 350)
    return () => clearTimeout(id)
  }, [input])

  const { data, isLoading, error, refetch } = useAdminGear({
    page,
    limit: 10,
    search: search || undefined,
  })
  const gears = data?.items ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/admin"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to admin dashboard
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Gear listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Read-only overview of all gear across providers
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by title or brand"
            className="pl-8"
            aria-label="Search gear by title or brand"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load gear. Please try again.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price/day</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      ) : gears.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 size-12 text-muted-foreground/50" />
          <p className="text-base font-medium text-foreground">No gear found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different search term."
              : "Provider listings will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gear</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/day</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gears.map((gear) => (
                <TableRow key={gear.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <GearThumb gear={gear} />
                      <div className="min-w-0">
                        <p className="max-w-52 truncate text-sm font-medium">
                          {gear.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{gear.brand}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{gear.provider?.name ?? "—"}</p>
                    <p className="max-w-44 truncate text-xs text-muted-foreground">
                      {gear.provider?.email}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {gear.category?.name ?? gear.categoryId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {typeof gear.pricePerDay === "number"
                      ? formatCurrency(gear.pricePerDay * 100)
                      : "—"}
                  </TableCell>
                  <TableCell>{gear.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={gear.isAvailable ? "default" : "secondary"}
                      className={cn(
                        gear.isAvailable &&
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      )}
                    >
                      {gear.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">
                        {gear.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({gear.totalReviews})
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {meta && meta.total > 0 && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <AlertCircle className="size-4" />
          {meta.total} listing{meta.total === 1 ? "" : "s"} found
        </p>
      )}
    </div>
  )
}
