import { Skeleton } from "@/components/ui/skeleton"

export default function GearDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <Skeleton className="mt-6 h-20 w-full" />
          <Skeleton className="mt-4 h-52 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
