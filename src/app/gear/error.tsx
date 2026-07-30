"use client"

import { Button } from "@/components/ui/button"

export default function GearError({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
        <p className="text-destructive">Something went wrong loading the gear listing.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => unstable_retry()}
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
