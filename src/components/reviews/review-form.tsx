"use client"

import { useForm, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reviewSchema } from "@/lib/schemas/review"
import { useCreateReview } from "@/lib/hooks/use-reviews"
import { ApiError } from "@/lib/api-client"
import { cn } from "@/lib/utils"

const reviewFormSchema = reviewSchema.extend({
  gearId: z.string().min(1, "Please select gear"),
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

interface ReviewFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: Array<{ gearId: string; title: string }>
}

export function ReviewForm({ open, onOpenChange, items }: ReviewFormProps) {
  const createReview = useCreateReview()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      gearId: items[0]?.gearId ?? "",
      rating: 0,
      comment: "",
    },
  })

  const rating = useWatch({ control: form.control, name: "rating" })

  async function onSubmit(data: ReviewFormValues) {
    try {
      await createReview.mutateAsync({
        gearId: data.gearId,
        rating: data.rating,
        comment: data.comment,
      })
      toast.success("Review submitted")
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error("Failed to submit review. Please try again.")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a review</DialogTitle>
          <DialogDescription>
            Share your experience with the gear you rented.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {items.length > 1 ? (
              <Controller
                name="gearId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="review-gear">Gear</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value ?? "")}
                    >
                      <SelectTrigger id="review-gear" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select gear" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Items in this order</SelectLabel>
                          {items.map((item) => (
                            <SelectItem key={item.gearId} value={item.gearId}>
                              {item.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : items.length === 1 ? (
              <p className="text-sm text-muted-foreground">
                Reviewing{" "}
                <span className="font-medium text-foreground">
                  {items[0].title}
                </span>
              </p>
            ) : null}

            <Field data-invalid={!!form.formState.errors.rating}>
              <FieldLabel htmlFor="rating">Rating</FieldLabel>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      form.setValue("rating", value, { shouldValidate: true })
                    }
                    aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                    className="cursor-pointer rounded-sm p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Star
                      className={cn(
                        "size-6 transition-colors",
                        value <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                ))}
              </div>
              {form.formState.errors.rating && (
                <FieldError errors={[form.formState.errors.rating]} />
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.comment}>
              <FieldLabel htmlFor="comment">Comment</FieldLabel>
              <Textarea
                id="comment"
                rows={4}
                placeholder="What did you like or dislike about this gear?"
                aria-invalid={!!form.formState.errors.comment}
                {...form.register("comment")}
              />
              {form.formState.errors.comment && (
                <FieldError errors={[form.formState.errors.comment]} />
              )}
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="accent"
            disabled={createReview.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {createReview.isPending ? "Submitting…" : "Submit review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
