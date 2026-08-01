"use client"

import { useForm, Controller } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { useCategories } from "@/lib/hooks/use-gear"
import { gearSchema, type GearFormValues } from "@/lib/schemas/gear"

export type { GearFormValues } from "@/lib/schemas/gear"

interface GearFormProps {
  defaultValues?: Partial<GearFormValues>
  onSubmit: (data: GearFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
}

export function GearForm({ defaultValues, onSubmit, isPending, submitLabel }: GearFormProps) {
  const { data: categories = [] } = useCategories()

  const form = useForm<GearFormValues>({
    resolver: zodResolver(gearSchema) as Resolver<GearFormValues>,
    defaultValues: {
      title: "",
      description: "",
      brand: "",
      categoryId: "",
      pricePerDay: 0,
      stock: 0,
      images: "",
      specifications: "",
      isAvailable: true,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Card className="rounded-lg border-border/80 shadow-sm shadow-black/[0.03]">
        <CardHeader className="border-b">
          <CardTitle>Listing details</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input {...field} id="title" placeholder="e.g. 4-Person Waterproof Tent" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea {...field} id="description" placeholder="Describe your gear..." aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Controller
                name="brand"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="brand">Brand</FieldLabel>
                    <Input {...field} id="brand" placeholder="e.g. NorthFace" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="categoryId" className="h-10 w-full bg-card" aria-invalid={fieldState.invalid}>
                        {field.value
                          ? (categories ?? []).find((cat) => cat.id === field.value)?.name
                          : <SelectValue placeholder="Select a category" />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {(categories ?? []).map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-border/80 shadow-sm shadow-black/[0.03]">
        <CardHeader className="border-b">
          <CardTitle>Pricing and availability</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="pricePerDay"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pricePerDay">Price per day ($)</FieldLabel>
                    <Input {...field} id="pricePerDay" type="number" step="0.01" min="0.01" placeholder="25.50" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="stock">Stock</FieldLabel>
                    <Input {...field} id="stock" type="number" min="0" placeholder="5" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="isAvailable"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal" className="rounded-lg border bg-muted/40 p-3 sm:col-span-2 lg:col-span-1 lg:mt-7">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isAvailable" />
                    <FieldLabel htmlFor="isAvailable">Available for rent</FieldLabel>
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-border/80 shadow-sm shadow-black/[0.03]">
        <CardHeader className="border-b">
          <CardTitle>Media and specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="images">
                    Image URLs <span className="text-muted-foreground">(comma-separated)</span>
                  </FieldLabel>
                  <Input {...field} id="images" placeholder="https://example.com/tent1.jpg, https://example.com/tent2.jpg" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="specifications"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="specifications">Specifications</FieldLabel>
                  <Textarea {...field} id="specifications" rows={4} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-4 border-t bg-background/90 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pt-0">
        <Button type="submit" variant="accent" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
