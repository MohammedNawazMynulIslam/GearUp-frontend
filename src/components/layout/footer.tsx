import Link from "next/link"
import { Tent } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold">
          <Tent className="size-4" aria-hidden="true" />
          GearUp
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/gear" className="hover:underline">
            Browse gear
          </Link>
          <Link href="/become-provider" className="hover:underline">
            Become a provider
          </Link>
        </nav>

        <p className="text-xs text-primary-foreground/60">
          &copy; {new Date().getFullYear()} GearUp. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
