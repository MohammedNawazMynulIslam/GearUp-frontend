"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/lib/hooks/use-categories"

export function GearFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const { data: categories } = useCategories()

  const currentCategory = searchParams.get("category") ?? ""
  const currentAvailableFrom = searchParams.get("availableFrom") ?? ""
  const currentAvailableTo = searchParams.get("availableTo") ?? ""

  const [minPrice, setMinPrice] = useState(() => searchParams.get("minPrice") ?? "")
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get("maxPrice") ?? "")

  const hasActiveFilters =
    currentCategory !== "" ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    currentAvailableFrom !== "" ||
    currentAvailableTo !== ""

  function navigate(qs: string) {
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  function buildQueryString(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === undefined || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete("page")
    return params.toString()
  }

  function handleCategoryChange(value: string | null) {
    navigate(buildQueryString("category", !value || value === "all" ? undefined : value))
  }

  function handleDateChange(key: string, value: string) {
    navigate(buildQueryString(key, value || undefined))
  }

  function handlePriceBlur(key: string) {
    const value = key === "minPrice" ? minPrice : maxPrice
    const current = searchParams.get(key) ?? ""
    if (value === current) return
    navigate(buildQueryString(key, value || undefined))
  }

  function handlePriceKeyDown(key: string, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const value = key === "minPrice" ? minPrice : maxPrice
      const current = searchParams.get(key) ?? ""
      if (value !== current) {
        navigate(buildQueryString(key, value || undefined))
      }
    }
  }

  function clearFilters() {
    setMinPrice("")
    setMaxPrice("")
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm shadow-black/3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr_auto] lg:items-end">
      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="category">Category</Label>
        <Select value={currentCategory || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full" id="category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="minPrice">Min price</Label>
        <Input
          id="minPrice"
          type="number"
          min={0}
          placeholder="$0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onBlur={() => handlePriceBlur("minPrice")}
          onKeyDown={(e) => handlePriceKeyDown("minPrice", e)}
          className="w-full"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="maxPrice">Max price</Label>
        <Input
          id="maxPrice"
          type="number"
          min={0}
          placeholder="$999"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={() => handlePriceBlur("maxPrice")}
          onKeyDown={(e) => handlePriceKeyDown("maxPrice", e)}
          className="w-full"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="availableFrom">Available from</Label>
        <Input
          id="availableFrom"
          type="date"
          value={currentAvailableFrom}
          onChange={(e) => handleDateChange("availableFrom", e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="availableTo">Available to</Label>
        <Input
          id="availableTo"
          type="date"
          value={currentAvailableTo}
          onChange={(e) => handleDateChange("availableTo", e.target.value)}
          className="w-full"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="w-full lg:w-auto" onClick={clearFilters}>
          <RotateCcw className="size-3" />
          Clear
        </Button>
      )}
      </div>
    </div>
  )
}
