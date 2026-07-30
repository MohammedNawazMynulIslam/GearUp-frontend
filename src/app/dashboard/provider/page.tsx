"use client"

import Link from "next/link"
import { Package, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/providers/auth-provider"

export default function ProviderDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">
          Welcome{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your gear listings and rental business
        </p>
      </div>

      <Separator className="mb-8" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="size-5 text-primary" />
            </div>
            <CardTitle className="mt-2">My Gear</CardTitle>
            <CardDescription>
              Add, edit, and manage your rental gear inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            View all your listed gear, check stock levels, and update pricing.
          </CardContent>
          <CardFooter>
            <Button
              variant="accent"
              size="sm"
              className="w-full"
              nativeButton={false}
              render={<Link href="/dashboard/provider/gear" />}
            >
              Manage gear
              <ArrowRight className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
