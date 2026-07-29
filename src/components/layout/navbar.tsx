"use client"

import Link from "next/link"
import { Tent } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const user = null
  // TODO(phase 8): wire to real auth

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
          <Tent className="size-5" aria-hidden="true" />
          GearUp
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" render={<Link href="/gear" />}>
            Browse gear
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" render={<Link href="/account" />}>
              My account
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Log in
              </Button>
              <Button variant="default" size="sm" render={<Link href="/signup" />}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
