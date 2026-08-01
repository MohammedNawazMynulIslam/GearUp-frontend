import DashboardSidebar from "@/components/layout/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen lg:pl-64">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-col">{children}</div>
    </div>
  )
}
