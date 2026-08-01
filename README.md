# GearUp — Frontend

**GearUp** is a modern web application for renting sports and outdoor equipment. Customers can browse a curated catalog of premium gear from local providers, book rentals, and pay online; providers can manage their inventory and process orders; and administrators have full oversight of users, categories, gear, and orders.

This repository contains the frontend application, built on the **Next.js App Router** and backed by the GearUp REST API.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### Authentication & Authorization
- JWT-based authentication with access tokens stored securely in cookies (secure, `SameSite=Strict`).
- Role-based access control across three roles: **Admin**, **Provider**, and **Customer**.
- Middleware (`src/proxy.ts`) enforces route protection, redirects unauthenticated users to login, and routes authenticated users to their role-specific dashboard.

### Gear Marketplace
- Public gear catalog with search, category filtering, sorting, and pagination.
- Rich gear detail pages with descriptions, specifications, pricing, stock, provider info, and image galleries.
- Customer reviews with star ratings and average-rating aggregation.

### Rental & Payments
- Full rental order lifecycle: placed → confirmed → paid → picked up → returned, with cancellation support.
- Secure online payments via **Stripe**, including hosted checkout sessions and payment-success/cancelation flows.
- Payment status tracking (pending, success, failed, refunded).

### Role-Based Dashboards
- **Customer:** view order history, track order/payment status, manage payments, and pay outstanding orders.
- **Provider:** manage gear listings (create, edit, delete), monitor stock and availability, and process incoming orders.
- **Admin:** manage users (including suspension), categories, gear listings, and all orders platform-wide.

---

## Tech Stack

| Layer            | Technology                                                            |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router, React Server Components) |
| UI Library       | [React 19](https://react.dev)                                          |
| Language         | [TypeScript](https://www.typescriptlang.org)                           |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com), shadcn/ui components, [lucide-react](https://lucide.dev) icons |
| Server State     | [TanStack Query](https://tanstack.com/query) (+ DevTools)              |
| Forms & Validation | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Auth             | `js-cookie` + `jwt-decode` (JWT session management)                    |
| Notifications    | [sonner](https://sonner.emilkowal.ski) toasts                          |
| Payments         | Stripe (via backend-issued checkout sessions)                          |

---

## Architecture

The application follows a feature-based structure under `src/`:

```
src/
├── app/                    # App Router pages & route groups
│   ├── auth/               # Login & registration
│   ├── dashboard/          # Role-based dashboards (admin, provider, customer)
│   ├── gear/               # Catalog listing & detail pages
│   ├── payment(s)/         # Checkout success & cancelation pages
│   └── page.tsx            # Public landing page
├── components/             # Feature-based UI components
│   ├── auth/               # Auth forms & related UI
│   ├── gear/               # Gear cards, grids, filters, detail
│   ├── layout/             # Navbar & footer
│   ├── payment/            # Checkout & payment UI
│   ├── providers/          # Query & auth context providers
│   ├── rentals/            # Order lifecycle components
│   ├── reviews/            # Review forms & displays
│   └── ui/                 # Reusable primitives (shadcn/ui)
├── lib/
│   ├── api-client.ts       # Typed HTTP client with JWT injection
│   ├── auth.ts             # Cookie-based token management
│   ├── jwt.ts              # Token decoding & expiry checks
│   ├── hooks/              # TanStack Query data-hook layer
│   └── schemas/            # Zod validation schemas
├── types/                  # Shared domain TypeScript types
└── proxy.ts                # Middleware for route protection & RBAC
```

**API integration:** the frontend calls a relative `/api/*` path, which Next.js rewrites to the backend base URL at build time (`next.config.ts`). All requests flow through a typed API client that attaches the current JWT as a `Bearer` token.

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **npm** (or your preferred package manager)
- A running instance of the GearUp backend API (or a deployed base URL)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MohammedNawazMynulIslam/GearUp-frontend.git
cd GearUp-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.local.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## Environment Variables

| Variable                | Description                                              | Example                                    |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_API_URL`   | Base URL of the GearUp backend API                       | `https://gear-up-backend-cyan.vercel.app`  |

---

## Available Scripts

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start the development server              |
| `npm run build`    | Create an optimized production build      |
| `npm run start`    | Start the production server               |
| `npm run lint`     | Run ESLint over the codebase              |

---

## Deployment

The easiest way to deploy is the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Before deploying, ensure `NEXT_PUBLIC_API_URL` is set to your production backend URL in the platform's environment variables. See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## License

This project is private and maintained for the GearUp platform.
