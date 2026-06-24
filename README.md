# Vela

A full-stack premium e-commerce store built with Next.js 15, featuring a curated product catalogue, Stripe-powered checkout, transactional emails, and a complete admin panel.

Design direction: **Premium Minimal** — warm cream palette, Hanken Grotesk, Newsreader italic serif accent, Space Mono labels.

![Vela Hero](https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1280&q=80)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Auth | NextAuth v5 (Auth.js) — GitHub OAuth + Credentials |
| Database | Neon (serverless PostgreSQL) |
| ORM | Prisma 5 |
| Payments | Stripe Checkout Sessions + Webhooks |
| Email | Resend + React Email |
| Cart state | Zustand + `persist` middleware |
| Animations | Framer Motion |
| Styling | Tailwind CSS + CSS custom properties |
| Fonts | Hanken Grotesk · Newsreader · Space Mono (Google Fonts) |
| Validation | Zod |

---

## Features

**Store**
- Landing page with editorial hero, category rail, and featured products grid
- Full product catalogue with filtering by category, sort, and search
- Product detail page with image gallery and related products
- Cart sidebar with Framer Motion spring animation
- Stripe Checkout with shipping address collection
- Order confirmation page (post-payment)
- Light / dark mode with zero-FOUC inline script

**Admin panel** (`/admin`)
- Revenue, order count, and product stats dashboard
- Full orders table with live status updates (Stripe → PAID → SHIPPED → DELIVERED)
- Products table with image, edit, and delete actions
- Create / edit product forms

**Auth**
- GitHub OAuth
- Email + password (bcrypt)
- Role-based access control (`USER` / `ADMIN`)

**Email**
- Order confirmation with itemised receipt, totals, and shipping address (React Email + Resend)

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/vela.git
cd vela
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
# Database — Neon connection string
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""          # openssl rand -base64 32

# GitHub OAuth — github.com/settings/applications/new
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe — dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend — resend.com/api-keys
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Vela <orders@yourdomain.com>"
```

### 3. Database setup

```bash
npx prisma generate
npx prisma db push
npm run db:seed        # creates admin user + 5 categories + 12 products
```

Seed credentials: `admin@shopforge.com` / `admin1234`

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stripe Webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed `whsec_...` secret into `STRIPE_WEBHOOK_SECRET` in your `.env`.

The webhook handler listens for `checkout.session.completed`, creates the order in the database, and fires the confirmation email.

---

## Project Structure

```
vela/
├── app/
│   ├── (store)/            # Public store routes
│   │   ├── page.tsx        # Landing page
│   │   ├── products/       # Catalogue + product detail
│   │   ├── cart/           # Cart page
│   │   └── orders/success/ # Post-checkout confirmation
│   ├── admin/              # Admin panel (ADMIN role required)
│   │   ├── page.tsx        # Dashboard
│   │   ├── orders/         # Order management
│   │   └── products/       # Product management
│   └── api/
│       ├── auth/           # NextAuth handler
│       ├── webhooks/stripe/ # Stripe webhook
│       └── admin/          # Admin REST endpoints
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── products/           # ProductCard, ProductFilters, ProductGallery
│   ├── cart/               # CartSidebar, CartPageClient, AddToCartButton
│   ├── admin/              # AdminSidebar, OrderStatusSelect, DeleteProductButton
│   └── ui/                 # ThemeToggle, SearchBar, Toaster
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── db.ts               # Prisma singleton
│   ├── stripe.ts           # Stripe client + helpers
│   └── resend.ts           # Email sender
├── store/
│   └── cart.ts             # Zustand cart store
├── actions/
│   ├── auth.ts             # signIn, signOut, register
│   └── checkout.ts         # startCheckout → Stripe redirect
├── emails/
│   └── OrderConfirmation.tsx
├── prisma/
│   └── schema.prisma
└── scripts/
    └── seed.ts
```

---

## Data Model

```
User ──< Order ──< OrderItem >── Product >── Category
User ──< Account (OAuth)
```

Key fields:
- `Product.price` — stored in cents (integer), formatted with `formatPrice()`
- `Order.status` — `PENDING → PAID → SHIPPED → DELIVERED | CANCELLED`
- `User.role` — `USER | ADMIN`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with demo data |
| `npm run email:dev` | Preview emails in browser |
