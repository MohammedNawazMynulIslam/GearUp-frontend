"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { CircleAlert, CircleCheck, ImageIcon, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency } from "@/lib/utils"
import type { Gear } from "@/types"

interface GearCardProps {
  gear: Gear
  variant?: "public" | "provider"
  onDelete?: (id: string) => void
}

export function GearCard({ gear, variant = "public", onDelete }: GearCardProps) {
  const [imgError, setImgError] = useState(false)
  const imageSrc = gear.images?.[0]

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/gear/${gear.id}`} className="absolute inset-0 z-0" aria-label={gear.title} />

      <CardHeader className="relative aspect-[4/3] overflow-hidden bg-muted p-0">
        {imageSrc && !imgError ? (
          <Image
            src={imageSrc}
            alt={gear.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="size-12 text-muted-foreground/40" />
          </div>
        )}
      </CardHeader>

      <CardContent className="relative z-10 flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-display text-sm font-medium">{gear.title}</h3>
          <p className="shrink-0 font-display text-sm font-semibold text-primary">
            {typeof gear.pricePerDay === "number"
              ? formatCurrency(gear.pricePerDay * 100)
              : "—"}
          </p>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">{gear.description}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Badge variant="secondary" className="max-w-[50%] truncate text-[10px]">
            {gear.brand}
          </Badge>

          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-medium",
              gear.isAvailable ? "text-emerald-600" : "text-muted-foreground"
            )}
          >
            {gear.isAvailable ? (
              <CircleCheck className="size-3" />
            ) : (
              <CircleAlert className="size-3" />
            )}
            {gear.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {variant === "provider" && (
          <div className="mt-2 flex gap-2 border-t pt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 flex-1 gap-1 text-xs"
              nativeButton={false}
              render={<Link href={`/dashboard/provider/gear/${gear.id}/edit`} />}
            >
              <Pencil className="size-3" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 flex-1 gap-1 text-xs"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                onDelete?.(gear.id)
              }}
            >
              <Trash2 className="size-3" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
