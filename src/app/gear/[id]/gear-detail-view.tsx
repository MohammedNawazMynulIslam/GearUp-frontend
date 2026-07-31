"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImageIcon, Star, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGearDetail } from "@/lib/hooks/use-gear"
import { useCreateRental } from "@/lib/hooks/use-rental-mutations"
import { useAuth } from "@/components/providers/auth-provider"
import { ApiError } from "@/lib/api-client"
import { cn, formatCurrency } from "@/lib/utils"
import type { Gear } from "@/types"

function tryParseSpecs(
  raw: string | null
): { key: string; value: string }[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) return null
      if (typeof parsed[0] === "object" && !Array.isArray(parsed[0])) {
        const entries = Object.entries(parsed[0])
        if (entries.length > 0) {
          return entries.map(([key, value]) => ({ key, value: String(value) }))
        }
      }
      if (typeof parsed[0] === "object" && "key" in parsed[0] && "value" in parsed[0]) {
        return parsed as { key: string; value: string }[]
      }
    }

    return null
  } catch {
    return null
  }
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imgError, setImgError] = useState(false)

  const current = images[selectedIndex]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        {current && !imgError ? (
          <Image
            src={current}
            alt={`${title} image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="size-16 text-muted-foreground/40" />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedIndex(i)
                setImgError(false)
              }}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-colors",
                i === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SpecsTable({ gear }: { gear: Gear }) {
  const specs = tryParseSpecs(gear.specifications)

  if (!specs || specs.length === 0) {
    if (gear.specifications) {
      return (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {gear.specifications}
        </p>
      )
    }
    return (
      <p className="text-sm text-muted-foreground">No specifications listed.</p>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <tbody>
          {specs.map(({ key, value }, i) => (
            <tr
              key={i}
              className={cn(
                "border-b last:border-none",
                i % 2 === 0 && "bg-muted/30"
              )}
            >
              <th className="w-2/5 px-4 py-2.5 text-left font-medium text-muted-foreground">
                {key}
              </th>
              <td className="px-4 py-2.5">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RentPanel({ gear }: { gear: Gear }) {
  const router = useRouter()
  const { user } = useAuth()
  const createRental = useCreateRental()

  const today = new Date().toISOString().split("T")[0]
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState("")
  const [pickupAddress, setPickupAddress] = useState("")
  const [quantity, setQuantity] = useState(1)

  async function handleRentNow() {
    if (!user) {
      router.push(`/auth/login?redirect=/gear/${gear.id}`)
      return
    }

    if (!fromDate || !toDate) {
      toast.error("Please select both start and end dates.")
      return
    }

    if (new Date(toDate) <= new Date(fromDate)) {
      toast.error("End date must be after start date.")
      return
    }

    if (!pickupAddress.trim()) {
      toast.error("Please enter a pickup address.")
      return
    }

    try {
      const rental = await createRental.mutateAsync({
        startDate: fromDate,
        endDate: toDate,
        pickupAddress: pickupAddress.trim(),
        items: [{ gearId: gear.id, quantity }],
      })

      if (!rental) {
        toast.error("Failed to create rental. Please try again.")
        return
      }

      toast.success("Rental created! Redirecting to payment…")
      router.push(`/dashboard/customer/orders/${rental.id}/pay`)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.payload.message)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rent this gear</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(gear.pricePerDay * 100)}
          </span>
          <span className="text-sm text-muted-foreground">/ day</span>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rent-from">From</Label>
            <Input
              id="rent-from"
              type="date"
              min={today}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rent-to">To</Label>
            <Input
              id="rent-to"
              type="date"
              min={fromDate || today}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pickup-address">Pickup address</Label>
          <Input
            id="pickup-address"
            type="text"
            placeholder="e.g. 123 Main St"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={gear.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(gear.stock, Math.max(1, Number(e.target.value))))}
          />
          <span className="text-xs text-muted-foreground">
            {gear.stock} available in stock
          </span>
        </div>

        <Button
          variant="accent"
          className="w-full"
          disabled={createRental.isPending}
          onClick={handleRentNow}
        >
          {createRental.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating rental…
            </>
          ) : (
            "Rent now"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function GearDetailView({ id }: { id: string }) {
  const { data: gear, isLoading, error } = useGearDetail(id)

  if (isLoading) return null

  if (error || !gear) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
          <p className="text-destructive">Failed to load gear details.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/gear"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to gear
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ImageGallery images={gear.images} title={gear.title} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl font-bold">{gear.title}</h1>
              <Badge
                variant={gear.isAvailable ? "default" : "secondary"}
                className="shrink-0"
              >
                {gear.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{gear.brand}</p>
            <div className="mt-1 flex items-center gap-1 text-sm">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">
                {gear.averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({gear.totalReviews} reviews)
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {gear.description}
          </p>

          <RentPanel gear={gear} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="size-4" />
                Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {gear.provider?.name ?? "Unknown"}
              </p>
              <p>{gear.provider?.email ?? gear.providerId}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold">
          Specifications
        </h2>
        <SpecsTable gear={gear} />
      </div>
    </div>
  )
}
