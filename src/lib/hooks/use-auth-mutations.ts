import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { setAuthToken, setRefreshToken } from "@/lib/auth"
import type { RegisterInput, LoginInput } from "@/lib/schemas/auth"
import type { User } from "@/types"

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => {
      const { confirmPassword, ...payload } = data
      return apiClient.post<AuthTokens>("/api/auth/register", payload)
    },
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAuthToken(data.accessToken)
      }
      if (data?.refreshToken) {
        setRefreshToken(data.refreshToken)
      }
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginInput) =>
      apiClient.post<LoginResponse>("/api/auth/login", data),
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAuthToken(data.accessToken)
      }
      if (data?.refreshToken) {
        setRefreshToken(data.refreshToken)
      }
    },
  })
}
