"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, RefreshCw, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GearGrid } from "@/components/gear/gear-grid"
import { useGearList } from "@/lib/hooks/use-gear"
import { useDeleteGear } from "@/lib/hooks/use-gear-mutations"
import { toast } from "sonner"
import { ApiError } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function ProviderGearListPage() {
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data, isLoading, error, refetch, isRefetching } = useGearList({ page, limit: 12 })
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
      ) : (
        <GearGrid
          items={gears}
          isLoading={isLoading}
          variant="provider"
          onDelete={(id) => setDeleteId(id)}
        />
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
