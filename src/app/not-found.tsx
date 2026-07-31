import Link from "next/link"
import { Tent, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Compass className="size-7 text-primary" />
      </div>
      <div>
        <p className="font-mono text-sm font-medium text-primary">404</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="accent" nativeButton={false} render={<Link href="/" />}>
          <Tent className="size-4" />
          Back home
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/gear" />}>
          Browse gear
        </Button>
      </div>
    </div>
  )
}
