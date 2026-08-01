"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Tags, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { useCategories } from "@/lib/hooks/use-gear"
import { useCreateCategory } from "@/lib/hooks/use-category-mutations"
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category"
import { toast } from "sonner"
import { ApiError } from "@/lib/api-client"
import { formatDate } from "@/lib/utils"

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, error, refetch } = useCategories()
  const createMutation = useCreateCategory()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    try {
      await createMutation.mutateAsync(data)
      toast.success("Category added")
      form.reset()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.payload.message)
      } else {
        toast.error("Failed to add category")
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the gear categories shown across the platform
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tags className="size-5 text-primary" />
              <CardTitle>All categories</CardTitle>
            </div>
            <CardDescription>
              Categories providers can assign to their gear
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                <AlertCircle className="size-8 text-destructive" />
                <p className="text-sm text-muted-foreground">
                  Failed to load categories.
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <ul className="divide-y">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{category.name}</p>
                      {category.description && (
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-xs text-muted-foreground">
                        /{category.slug}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(category.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tags className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-base font-medium">No categories yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first category to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="size-5 text-primary" />
              <CardTitle>Add category</CardTitle>
            </div>
            <CardDescription>
              Create a new category for providers to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        placeholder="e.g. Tents"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        {...field}
                        id="description"
                        rows={3}
                        placeholder="Optional short description"
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
                  className="w-full sm:w-auto"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    "Adding…"
                  ) : (
                    <>
                      <Check className="size-4" />
                      Add category
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
