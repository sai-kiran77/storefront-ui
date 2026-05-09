# StoreFront UI

A small React + TypeScript single-page storefront with product browsing, search, multi-attribute filtering, and a persistent cart with stock-limit enforcement.

## Tech stack

- **React 19** + **TypeScript** (Vite + SWC)
- **react-router-dom** for client-side routing
- **Context + useReducer** for cart state (no third-party state library)
- **CSS** — hand-written, BEM-ish naming, design tokens in `src/styles/tokens.css`
- **FontAwesome 6** via CDN for icons

No UI kit, no CSS-in-JS, no Redux. Stays close to the platform.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to ./dist
npm run preview  # serve the production build
```

Tested with Node 20+.

## Folder structure

```
src/
├── api/             API client (fetches the products endpoint)
├── components/      Reusable UI (Navbar, ProductCard, SearchBar, FilterPanel, CartToast)
├── context/         ProductsContext, CartContext (provider + hook)
├── hooks/           useFilteredProducts (composes search + filters)
├── pages/           ProductListPage, CartPage
├── styles/          tokens.css, reset.css, global.css
├── types/           product.ts, cart.ts, filters.ts
└── utils/           searchMatch.ts, formatPrice.ts
```

## Features

### Product listing
- Fetches the catalogue once on mount via `ProductsContext`
- Loading + error states with a retry action
- Responsive grid (2 cols → 4 cols across breakpoints)

### Search
- Free-text search across `name`, `color`, and `type`
- **Token-based AND match** — `green polo` matches "Green Polo" because every token has to find a hit
- Submit on Enter (`<form onSubmit>`)
- Search button uses the spec-required `search-button-container` class

### Filters
- Exact spec labels: **Gender**, **Colour**, **Price range**, **Type**
- Options are **derived from the product list at runtime** — adapts to new API values without code changes
- Price range as `min`/`max` number inputs (`null` = unbounded)
- Filters and search are local component state, so they reset on navigation per the spec
- "Clear all" resets every filter; disabled when no filter is active
- Mobile: collapses into an expandable panel with an active-count badge

### Cart
- `CartContext` exposes `addToCart`, `incrementQty`, `decrementQty`, `removeFromCart`, `clearCart`, plus derived `itemCount` and `totalAmount`
- **Persisted to `localStorage`** under a versioned key (`storefront.cart.v1`); errors are transient and not persisted
- Cart items snapshot the product (name, image, price, currency, stock) at add-time so the cart still renders if the live catalogue changes
- **Stock-limit enforcement in the reducer**: ADD/INCREMENT past `stock` are rejected and set a user-facing `error`
- Errors surface via a global `CartToast` (auto-dismiss + manual dismiss)
- Errors auto-clear on the next successful cart action
- CartPage: per-line image, name, price, qty stepper, line total, remove; grand total + Clear cart; empty-cart state with a "Browse products" CTA
- `+` is **disabled at stock limit** (UX hint via `title`); the reducer is still the source of truth

### Navbar
- Cart icon with a badge showing the **number of distinct products** in the cart
- Active route highlighting

## Architecture decisions & tradeoffs

**Why Context + useReducer for the cart?** Single source of truth, predictable transitions, easy to test in isolation. Redux/Zustand would be overkill for a five-action reducer.

**Why a `Filters` object instead of URL query params?** The spec calls out that filters and search shouldn't be retained on navigation. Local component state honours that for free; URL params would actively work against it.