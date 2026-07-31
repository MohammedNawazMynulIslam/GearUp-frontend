import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { PaginatedResponse, Role, User } from "@/types"

export interface AdminUserListParams {
  page?: number
  limit?: number
  search?: string
  role?: Role
  isSuspended?: string
}

function buildQueryString(params: AdminUserListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function useAdminUsers(params: AdminUserListParams = {}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: (): Promise<PaginatedResponse<User> | null> =>
      apiClient.getPaginated<User>(`/api/admin/users${buildQueryString(params)}`),
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      isSuspended,
    }: {
      userId: string
      isSuspended: boolean
    }) => apiClient.patch<User>(`/api/admin/users/${userId}`, { isSuspended }),
    onMutate: async ({ userId, isSuspended }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-users"] })
      const previous = queryClient.getQueriesData<PaginatedResponse<User>>({
        queryKey: ["admin-users"],
      })
      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: ["admin-users"] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            items: old.items.map((user) =>
              user.id === userId ? { ...user, isSuspended } : user
            ),
          }
        }
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
  })
}
