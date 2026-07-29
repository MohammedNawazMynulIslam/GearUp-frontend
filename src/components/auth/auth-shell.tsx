import Link from "next/link"
import { Tent } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AuthShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="contour-bg flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-primary px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold text-primary-foreground"
        >
          <Tent className="size-6" aria-hidden="true" />
          GearUp
        </Link>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
