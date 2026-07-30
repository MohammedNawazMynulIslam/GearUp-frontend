import { ApiErrorPayload, ApiResponse, PaginationMeta } from "@/types"
import { getAuthToken } from "./auth"

export class ApiError extends Error {
  status: number
  payload: ApiErrorPayload

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T | null> {
  const url = path

  const headers: Record<string, string> = {}
  const token = getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) {
    return null
  }

  const json: ApiResponse<T> = await res.json()

  if (!res.ok) {
    throw new ApiError(res.status, json as unknown as ApiErrorPayload)
  }

  return json.data
}

async function requestPaginated<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<{ items: T[]; meta: PaginationMeta } | null> {
  const url = path

  const headers: Record<string, string> = {}
  const token = getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) {
    return null
  }

  const json: ApiResponse<T[]> = await res.json()

  if (!res.ok) {
    throw new ApiError(res.status, json as unknown as ApiErrorPayload)
  }

  return { items: json.data, meta: json.meta as PaginationMeta }
}

export const apiClient = {
  get<T>(path: string): Promise<T | null> {
    return request<T>("GET", path)
  },

  post<T>(path: string, body?: unknown): Promise<T | null> {
    return request<T>("POST", path, body)
  },

  patch<T>(path: string, body?: unknown): Promise<T | null> {
    return request<T>("PATCH", path, body)
  },

  put<T>(path: string, body?: unknown): Promise<T | null> {
    return request<T>("PUT", path, body)
  },

  delete<T>(path: string): Promise<T | null> {
    return request<T>("DELETE", path)
  },

  getPaginated<T>(path: string): Promise<{ items: T[]; meta: PaginationMeta } | null> {
    return requestPaginated<T>("GET", path)
  },
}
