"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

import { loginSchema, type LoginInput } from "@/lib/schemas/auth"
import { useLogin } from "@/lib/hooks/use-auth-mutations"
import { useAuth } from "@/components/providers/auth-provider"
import { dashboardPathForRole, getCurrentUser } from "@/lib/auth"
import { ApiError } from "@/lib/api-client"
import type { Role } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"

export default function LoginForm() {
  const loginMutation = useLogin()
  const { refresh } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginInput) {
    try {
      await loginMutation.mutateAsync(data)
      refresh()
      toast.success("Welcome back!")
      const user = getCurrentUser()
      if (user) {
        router.push(redirect ?? dashboardPathForRole(user.role as Role))
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                {...field}
                id="password"
                placeholder="Your password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button
          type="submit"
          variant="accent"
          className="mt-2 w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in…" : "Log in"}
        </Button>
      </FieldGroup>
    </form>
  )
}
