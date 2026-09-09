# SHOP.CO E-Commerce Platform

A modern, responsive full-stack e-commerce application built with React 19, Vite, SCSS, Node.js, Express, and MongoDB.

---

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run start   # Starts on port 5000
```
To seed sample products, categories, admin, and customer users:
```bash
node seed.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts Vite development server
```

### 3. Demo Credentials
- **Admin Account**:
  - Email: `admin@shop.co`
  - Password: `admin123`
- **Customer Account**:
  - Email: `anshuman@example.com`
  - Password: `customer123`

---

## Features & Pages

- **Home**: Hero with stats counter, New Arrivals, Top Selling, Browse by Dress Style, Customer Reviews, and Newsletter signup.
- **Categories**: Dedicated categories view loaded from MongoDB with direct links to filtered catalog.
- **Product Listing**:
  - Debounced name search (case-insensitive, partial matching).
  - Category, Price range, and Availability filters (In Stock / Out of Stock).
  - Multi-criteria sorting (Price low-to-high, high-to-low, Newest, Name).
  - Server-side pagination with automatic page resets on filter/search updates.
- **Product Details**:
  - Image gallery, product description, rating, price and discount calculation.
  - Stock availability and inventory states (In Stock, Low Stock, and Out of Stock).
  - Color and size selection.
  - Quantity selector respecting inventory stock.
  - Out of stock state disables purchasing.
  - Related product recommendations ("You Might Also Like").
- **Cart**:
  - Quantity adjustments with inventory clamping.
  - Promo code discounts: `SAVE10` (10% discount) and `SAVE20` (20% discount).
  - Subtotal, discount amount, flat delivery fee, and final total calculated with `useMemo`.
- **Checkout**:
  - Protected route requiring authentication.
  - Shipping address pre-fill and validation.
  - Backend order total calculation and verification.
  - Inventory decremented atomically in MongoDB upon successful checkout.
  - Automatic cart clearing.
- **Authentication**:
  - JWT token stored in localStorage for persistent sessions across page refreshes.
  - Customer vs Admin role protection.
- **Profile & Order History**:
  - Profile details viewer and editor (Name, Phone, Delivery Address). Role is protected and read-only.
  - Order history showing order ID, placement date, items, quantities, totals, and order status.
- **Order Details**:
  - Visual status progress timeline (`Order received` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`).
  - Purchased products line items and delivery recipient details.
- **Admin Panel**:
  - **Dashboard**: High-level store metrics (Total Products, Categories, Users, Orders, Out of Stock, Low Stock).
  - **Products**: Complete product CRUD, stock updates, category assignment, and stock alerts.
  - **Categories**: Category CRUD management.
  - **Orders**: View all customer orders and live update order progress statuses.

---

## Inventory & Low Stock Logic

- **Out of Stock**: `quantity === 0`. The product display shows a prominent `OUT OF STOCK` badge, disables the "Add to Cart" button, sets the quantity selector to 0, and disallows checkout.
- **Low Stock Threshold**: `quantity <= 10 && quantity > 0`.
  - In the customer-facing views, products display an attention badge (e.g. `Only 4 left`).
  - In the Admin Panel, the dashboard computes low-stock counts via `Product.countDocuments({ quantity: { $lte: 10, $gt: 0 } })`.
  - The admin dashboard highlights an **Inventory Attention Required** warning banner whenever any product has reached low stock or out of stock, allowing immediate restocking.

---

## React Performance Optimizations

1. **`useMemo`**:
   - `CartContext`: Memoizes `subtotal`, `discountPercent`, `discountAmount`, `deliveryFee`, `total`, and `totalItems` so that calculations only run when cart contents or coupon code changes.
   - `ProductListingPage`: Memoizes the count of active filters and composite query parameters.
   - `AdminDashboard`: Memoizes computed inventory statistics.
2. **`useCallback`**:
   - Stable references for handlers like `addToCart`, `updateQuantity`, `removeFromCart`, `applyCoupon`, `handleCategorySelect`, `handleSortChange`, and `handlePriceApply` to avoid child component re-renders.
3. **`React.memo`**:
   - Wrapped `ProductCard`, preventing all product grid cards from re-rendering when parent state (such as search bar typing) changes.
4. **Lazy Loading & Route-level Code Splitting**:
   - `React.lazy()` and `<Suspense>` used across all non-landing routes: Categories, Product Listing, Product Details, Cart, Checkout, Auth, Profile, Order Details, and the entire Admin suite (`AdminLayout`, `AdminDashboard`, `AdminProducts`, `AdminCategories`, `AdminOrders`).
   - Admin code is completely decoupled from the customer bundle, keeping the initial payload minimal.

---

## Core Web Vitals (CWV) Optimizations

1. **Largest Contentful Paint (LCP)**:
   - Font loading with `@font-face` uses `font-display: swap` for Satoshi and Integral CF, ensuring fast text rendering without invisible text during font loading.
   - Hero banner and above-the-fold assets are served with native responsive styling.
2. **Cumulative Layout Shift (CLS)**:
   - All product card image containers have explicit aspect ratios (`aspect-ratio: 1 / 1.05`) preventing layout jumps when images load.
   - Fixed header heights and stable grid layouts avoid layout shifts during API data fetching.
3. **Interaction to Next Paint (INP)**:
   - Search bar input uses a **350ms debounce** to ensure keystrokes respond instantaneously without firing rapid network requests or freezing the main thread.
   - Heavy state operations (such as cart updates) use lightweight local state before propagating changes.

---

## SCSS Architecture

- **Abstracts**: `_variables.scss` (rems, percentages, colors, fonts, breakpoints) and `_mixins.scss` (flexbox, buttons, responsive media queries).
- **Base**: `_reset.scss` and `_base.scss` (typography, font faces, global containers).
- **Components**: `_navbar.scss`, `_footer.scss`, `_product-card.scss`, `_spinner.scss`.
- **Pages**: `_home.scss`, `_categories.scss`, `_products.scss`, `_product-details.scss`, `_cart.scss`, `_checkout.scss`, `_auth.scss`, `_profile.scss`, `_orders.scss`, `_admin.scss`.
- Zero hardcoded pixel values for layout and spacing; uses semantic rems and percentages throughout.

