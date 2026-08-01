import DashboardSidebar from "@/components/layout/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background lg:pl-72">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
