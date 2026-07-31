"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, Users, AlertCircle } from "lucide-react"
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
import { useAdminUsers, useUpdateUserStatus } from "@/lib/hooks/use-admin-users"
import { toast } from "sonner"
import { ApiError } from "@/lib/api-client"
import { cn, formatDate } from "@/lib/utils"
import type { User } from "@/types"

function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="ml-auto h-7 w-20 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function AdminUsersPage() {
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

  const { data, isLoading, error, refetch } = useAdminUsers({
    page,
    limit: 10,
    search: search || undefined,
  })
  const updateMutation = useUpdateUserStatus()
  const users = data?.items ?? []
  const meta = data?.meta
  const pendingUserId = updateMutation.variables?.userId

  async function handleToggle(user: User) {
    const next = !user.isSuspended
    try {
      await updateMutation.mutateAsync({ userId: user.id, isSuspended: next })
      toast.success(next ? "User suspended" : "User activated")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error(next ? "Failed to suspend user" : "Failed to activate user")
      }
    }
  }

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
          <h1 className="font-display text-2xl font-bold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search accounts and manage their access
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by name or email"
            className="pl-8"
            aria-label="Search users by name or email"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load users. Please try again.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="mb-4 size-12 text-muted-foreground/50" />
          <p className="text-base font-medium text-foreground">No users found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different search term."
              : "Registered users will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isPending = pendingUserId === user.id && updateMutation.isPending
                const isAdmin = user.role === "ADMIN"
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="max-w-52 truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.phone ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isSuspended ? "destructive" : "default"}
                        className={cn(
                          !user.isSuspended &&
                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        )}
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Button
                          variant={user.isSuspended ? "outline" : "destructive"}
                          size="xs"
                          onClick={() => handleToggle(user)}
                          disabled={isPending}
                        >
                          {isPending
                            ? "Updating…"
                            : user.isSuspended
                              ? "Activate"
                              : "Suspend"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
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
          {meta.total} user{meta.total === 1 ? "" : "s"} found
        </p>
      )}
    </div>
  )
}
