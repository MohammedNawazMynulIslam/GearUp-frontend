import type { Metadata } from "next"
import AuthShell from "@/components/auth/auth-shell"
import RegisterForm from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account | GearUp",
}

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account">
      <RegisterForm />
    </AuthShell>
  )
}
