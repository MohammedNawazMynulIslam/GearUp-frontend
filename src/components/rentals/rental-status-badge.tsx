import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  PLACED: { label: "Placed", className: "bg-status-placed-bg text-status-placed-fg" },
  CONFIRMED: { label: "Confirmed", className: "bg-status-confirmed-bg text-status-confirmed-fg" },
  PAID: { label: "Paid", className: "bg-status-paid-bg text-status-paid-fg" },
  PICKED_UP: { label: "Picked up", className: "bg-status-picked-up-bg text-status-picked-up-fg" },
  RETURNED: { label: "Returned", className: "bg-status-returned-bg text-status-returned-fg" },
  CANCELLED: { label: "Cancelled", className: "bg-status-cancelled-bg text-status-cancelled-fg" },
}

export function RentalStatusBadge({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) {
  const config = statusStyles[status] ?? statusStyles.PLACED
  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
