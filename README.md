# Bazaarly — Multi-Category Indian E-Commerce Marketplace (Phase 1 Storefront)

A customer-facing multi-category e-commerce marketplace storefront built for the Indian market (`en-IN`, INR `₹`) with React 19, TypeScript, React Router, and a custom CSS token design system.

## 1. Architecture Overview

```text
src/
  config/
    store.ts          # Editable store name, announcement bar, contact & GSTIN placeholders
    homepage.ts       # Ordered, modular homepage sections configuration
  data/
    categories.ts     # 7 core departments + category-specific visual presentation & filter attributes
    products.ts       # 32 demo products with flexible attributes, specifications, options & variants
    promotions.ts     # Demo promotional banners
    images.ts         # Central image registry (local editorial photography + remote demo assets)
  types/
    catalog.ts        # Domain types with sellerId & variant hooks for future multi-vendor support
  services/
    catalog.ts        # Data access abstraction layer (swap for REST/GraphQL API later)
  lib/
    format.ts         # INR currency formatting, discount & stock calculation helpers
    filters.ts        # Pure search, category, price, availability, attribute & sort functions
    seo.ts            # Document title, meta description, canonical & Open Graph updater
    __tests__/        # Vitest unit test suite
  state/
    CartContext.tsx   # Persistent cart state (stores only productId, variantId & quantity)
  components/
    layout/           # Header, MobileMenu drawer, Footer, Layout shell
    product/          # Category-aware ProductCard & Price components
    home/             # Modular homepage sections (Hero, CategoryGrid, ProductRail, Promo, Collection, ValueProps, Newsletter)
    ui/               # Icon, Logo, SmartImage (with aspect ratio & error fallback)
  pages/
    Home.tsx          # Config-driven homepage
    Shop.tsx          # Full catalogue listing with URL-synced search, filters, sorting & load-more
    CategoryPage.tsx  # Shared data-driven category template
    ProductDetailPage.tsx # Gallery, variant picker, dynamic specs, PIN check placeholder & JSON-LD
    CartPage.tsx      # Cart management & INR subtotal summary
    CheckoutPage.tsx  # Validated Indian shipping address form & demo checkout review
    SupportPages.tsx  # About, Contact, FAQ, Shipping, Returns, Privacy, Terms & 404 pages
  styles/
    layout.css        # Header, navigation, mobile drawer & footer styles
    home.css          # Homepage & category-adapted product card styles
    catalog.css       # Shop, Category & Product Detail styles
    checkout.css      # Cart, Checkout & Supporting page styles
```

## 2. Scripts

- `npm run dev` — Start Vite development server
- `npm run lint` — Run ESLint across the codebase
- `npx vitest run` — Run unit tests for pricing, filtering, sorting, and cart state
- `npm run build` — Typecheck (`tsc -b`) and build production bundle (`vite build`)

## 3. Features Requiring a Future Backend

All customer-facing discovery, filtering, sorting, variant selection, cart persistence, and form validation work in the browser today. The following capabilities are explicitly marked as placeholders and require a backend service before commercial launch:

1. **Checkout & Payment Processing (`/checkout`)**: Validates Indian shipping addresses and contact details client-side, but does not create real orders or charge payments. Connect a backend order service and an Indian payment gateway (e.g., Razorpay, PayU, Cashfree) and re-validate prices and stock server-side.
2. **Customer Accounts (`/account`)**: Sign-in, saved addresses, and order history require authentication infrastructure.
3. **Multi-Seller & Vendor Operations**: `Product.sellerId` and variant-level inventory are included in `src/types/catalog.ts`. Seller onboarding, vendor dashboards, split-seller order routing, and payouts belong to a future backend phase.
4. **Live Courier PIN Serviceability**: The 6-digit Indian PIN code checker on product pages validates the PIN format and displays a placeholder estimate until connected to a logistics aggregator API.
5. **Newsletter & Contact Forms**: Forms validate inputs and display explicit demo confirmations without transmitting personal data.
