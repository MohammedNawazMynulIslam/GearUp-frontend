"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Plus,
  RefreshCw,
  ChevronLeft,
  Pencil,
  Trash2,
  ImageIcon,
  Star,
  SearchX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useProviderGear } from "@/lib/hooks/use-gear"
import { useDeleteGear } from "@/lib/hooks/use-gear-mutations"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"
import { ApiError } from "@/lib/api-client"
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
          <TableCell>
            <div className="flex justify-end gap-2">
              <Skeleton className="h-7 w-14 rounded-md" />
              <Skeleton className="h-7 w-14 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function ProviderGearListPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data, isLoading, error, refetch, isRefetching } = useProviderGear(
    user?.id ?? "",
    { page, limit: 12 }
  )
  const deleteMutation = useDeleteGear()
  const gears = data?.items ?? []
  const meta = data?.meta

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success("Gear deleted")
      setDeleteId(null)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error("Failed to delete gear")
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/provider"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to dashboard
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">My Gear</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your rental gear inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="accent" size="sm" nativeButton={false} render={<Link href="/dashboard/provider/gear/new" />}>
            <Plus className="size-4" />
            Add gear
          </Button>
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
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      ) : gears.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SearchX className="mb-4 size-12 text-muted-foreground/50" />
          <p className="text-base font-medium text-foreground">No gear yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first gear listing to start renting it out.
          </p>
          <Button
            variant="accent"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href="/dashboard/provider/gear/new" />}
          >
            <Plus className="size-4" />
            Add gear
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gear</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/day</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        <p className="text-xs text-muted-foreground">
                          {gear.brand}
                        </p>
                      </div>
                    </div>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        nativeButton={false}
                        render={
                          <Link href={`/dashboard/provider/gear/${gear.id}/edit`} />
                        }
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="xs"
                        onClick={() => setDeleteId(gear.id)}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
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
          </Button>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete gear</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this gear? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
