export type Role = "ADMIN" | "PROVIDER" | "CUSTOMER"

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED"

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED"

export type PaymentProvider = "STRIPE"

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  role: Role
  isSuspended: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface GearProvider {
  id: string
  name: string
  email: string
}

export interface Gear {
  id: string
  providerId: string
  categoryId: string
  title: string
  description: string
  brand: string
  pricePerDay: number
  stock: number
  images: string[]
  specifications: string | null
  isAvailable: boolean
  averageRating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
  category?: Category
  provider?: GearProvider
  reviews?: Review[]
}

export interface RentalOrder {
  id: string
  customerId: string
  startDate: string
  endDate: string
  totalDays: number
  subtotal: number
  discount: number | null
  totalAmount: number
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  pickupAddress: string
  notes: string | null
  createdAt: string
  updatedAt: string
  customer?: {
    id: string
    name: string
    email: string
  }
  items?: RentalItem[]
}

export interface RentalItem {
  id: string
  orderId: string
  gearId: string
  quantity: number
  pricePerDay: number
  createdAt?: string
  gear?: {
    id: string
    title: string
    brand: string
    pricePerDay: number
    stock: number
    providerId: string
  }
}

export interface Payment {
  id: string
  orderId: string
  transactionId: string | null
  provider: PaymentProvider
  amount: number
  status: PaymentStatus
  paidAt: string | null
  createdAt: string
  updatedAt: string
  order?: {
    id: string
    customerId: string
    totalAmount: number
    orderStatus: OrderStatus
    paymentStatus: PaymentStatus
    startDate: string
    endDate: string
  }
}

export interface Review {
  id: string
  customerId: string
  gearId: string
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  meta?: PaginationMeta
  data: T
}

export interface ApiErrorPayload {
  success: false
  message: string
  errors?: unknown
}

export interface CreatePaymentResponse {
  paymentId: string
  sessionId: string
  transactionId: string
  url: string
  amount: number
  currency: string
  status: PaymentStatus
  provider: PaymentProvider
}

export interface PaymentSessionStatus {
  sessionId: string
  paymentId: string
  orderId: string
  amount: number
  status: PaymentStatus
  paidAt: string | null
  orderStatus: OrderStatus
}
