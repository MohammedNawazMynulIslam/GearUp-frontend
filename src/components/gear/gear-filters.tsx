"use client"

import { useRef, useState, useTransition, useCallback } from "react"
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

  const [formKey, setFormKey] = useState(0)
  const minPriceRef = useRef<HTMLInputElement>(null)
  const maxPriceRef = useRef<HTMLInputElement>(null)

  const currentCategory = searchParams.get("category") ?? ""
  const currentAvailableFrom = searchParams.get("availableFrom") ?? ""
  const currentAvailableTo = searchParams.get("availableTo") ?? ""
  const urlMinPrice = searchParams.get("minPrice") ?? ""
  const urlMaxPrice = searchParams.get("maxPrice") ?? ""

  const hasActiveFilters =
    currentCategory !== "" ||
    urlMinPrice !== "" ||
    urlMaxPrice !== "" ||
    currentAvailableFrom !== "" ||
    currentAvailableTo !== ""

  const updateURL = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  function replaceURL(qs: string) {
    startTransition(() => {
      router.replace(`${pathname}?${qs}`, { scroll: false })
    })
  }

  function handleCategoryChange(value: string | null) {
    replaceURL(updateURL({ category: !value || value === "all" ? undefined : value }))
  }

  function handleDateChange(key: string, value: string) {
    replaceURL(updateURL({ [key]: value || undefined }))
  }

  function handlePriceBlur(key: string) {
    const value = key === "minPrice"
      ? minPriceRef.current?.value
      : maxPriceRef.current?.value
    replaceURL(updateURL({ [key]: value || undefined }))
  }

  function handlePriceKeyDown(key: string, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handlePriceBlur(key)
    }
  }

  function clearFilters() {
    setFormKey((k) => k + 1)
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">Category</Label>
        <Select value={currentCategory || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-44" id="category">
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="minPrice">Min price</Label>
        <Input
          id="minPrice"
          key={`minPrice-${formKey}`}
          ref={minPriceRef}
          type="number"
          min={0}
          placeholder="$0"
          defaultValue={urlMinPrice}
          onBlur={() => handlePriceBlur("minPrice")}
          onKeyDown={(e) => handlePriceKeyDown("minPrice", e)}
          className="w-28"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="maxPrice">Max price</Label>
        <Input
          id="maxPrice"
          key={`maxPrice-${formKey}`}
          ref={maxPriceRef}
          type="number"
          min={0}
          placeholder="$999"
          defaultValue={urlMaxPrice}
          onBlur={() => handlePriceBlur("maxPrice")}
          onKeyDown={(e) => handlePriceKeyDown("maxPrice", e)}
          className="w-28"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="availableFrom">Available from</Label>
        <Input
          id="availableFrom"
          type="date"
          value={currentAvailableFrom}
          onChange={(e) => handleDateChange("availableFrom", e.target.value)}
          className="w-44"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="availableTo">Available to</Label>
        <Input
          id="availableTo"
          type="date"
          value={currentAvailableTo}
          onChange={(e) => handleDateChange("availableTo", e.target.value)}
          className="w-44"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <RotateCcw className="size-3" />
          Clear
        </Button>
      )}
    </div>
  )
}
