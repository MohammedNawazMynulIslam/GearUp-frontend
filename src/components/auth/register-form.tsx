"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
  registerSchema,
  type RegisterInput,
} from "@/lib/schemas/auth"
import { useRegister } from "@/lib/hooks/use-auth-mutations"
import { useAuth } from "@/components/providers/auth-provider"
import { dashboardPathForRole, getCurrentUser } from "@/lib/auth"
import { ApiError } from "@/lib/api-client"
import type { Role } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterForm() {
  const registerMutation = useRegister()
  const { refresh } = useAuth()
  const router = useRouter()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  })

  async function onSubmit(data: RegisterInput) {
    try {
      await registerMutation.mutateAsync(data)
      refresh()
      toast.success("Account created! Welcome to GearUp.")
      const user = getCurrentUser()
      if (user) {
        router.push(dashboardPathForRole(user.role as Role))
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
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

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
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="role">I want to</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="role"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">
                    Rent gear (Customer)
                  </SelectItem>
                  <SelectItem value="PROVIDER">
                    List gear (Provider)
                  </SelectItem>
                </SelectContent>
              </Select>
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending
            ? "Creating account…"
            : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  )
}
