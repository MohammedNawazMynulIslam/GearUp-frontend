import type { Metadata } from "next"
import { Suspense } from "react"
import AuthShell from "@/components/auth/auth-shell"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log In | GearUp",
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}
