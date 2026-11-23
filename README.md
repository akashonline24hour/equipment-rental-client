# RentGear — Equipment Rental Platform (Client)

A modern, full-stack **Equipment Rental Platform** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **DaisyUI**. RentGear connects equipment owners with customers through a transparent, role-based rental marketplace featuring server-side search and filtering, Stripe online checkout, interactive analytics dashboards, and persistent Light/Dark theming.

- **Live Site:** [https://equipment-rental-client-rho.vercel.app](https://equipment-rental-client-rho.vercel.app)
- **Client Repository:** [https://github.com/akashonline24hour/equipment-rental-client](https://github.com/akashonline24hour/equipment-rental-client)
- **Server Repository:** [https://github.com/akashonline24hour/equipment-rental-server](https://github.com/akashonline24hour/equipment-rental-server)

---

## Key Features

### Public Experience & Discovery
- **Responsive Home Page:** Animated hero banner, featured approved equipment showcase (6 items), popular categories, "Why Choose Us" value propositions, customer reviews, and additional discovery sections powered by **Framer Motion**.
- **All Equipment Catalog:** 3-column responsive grid with **backend-powered search** (by equipment name or location), multi-criteria **filtering** (category, rental type, price range, availability), **sorting** (price low-to-high, high-to-low, recently added), and pagination.
- **Custom Light & Dark Theme:** Persistent `rentgear` (Light) and `rentgear-dark` (Dark) DaisyUI themes saved in `localStorage` with instant toggling from the navigation bar.

### Authentication & Role-Based Access Control (RBAC)
- **BetterAuth + JWT Integration:** Email/password registration and login with uppercase/lowercase/length validation, plus **Google & GitHub OAuth** social login (defaulting new social accounts to the `customer` role).
- **Protected Routes & Middleware:** Next.js route protection and role guards separating **Customer**, **Owner**, and **Admin** experiences across reloads without unwanted login redirects.

### Booking & Stripe Checkout Flow
- **Equipment Details (Private):** Full equipment specifications, owner info, rental terms, availability count, and **Favorites** management.
- **Interactive Booking Modal:** Date range selection, quantity validation, contact/delivery details, automatic rental cost calculation, and real-time availability checks.
- **Stripe Payment Integration:** Seamless redirect to Stripe Checkout upon booking confirmation, followed by automated payment verification and booking record creation.

### Role-Specific Dashboards
- **Customer Dashboard:** View rental booking history and payment statuses (`My Rentals`), manage saved items (`Favorites`), and update personal profile details (`Profile`).
- **Owner Dashboard:** List new equipment with **ImgBB** image uploads (`Add Equipment`), manage inventory (`My Equipment`), track incoming rentals (`My Equipment Rental`), view business analytics charts, and edit profile info.
- **Admin Dashboard:** Monitor platform-wide KPIs and revenue charts, manage user roles (`All Users`), approve/reject/manage listings (`All Equipment`), and oversee all transactions (`All Rentals`).

---

## Tech Stack & NPM Packages

- **Framework & Language:** `next` (App Router), `react`, `react-dom`, `typescript`
- **Styling & UI:** `tailwindcss`, `daisyui`, `lucide-react`, `react-icons`
- **Animations & Feedback:** `framer-motion`, `react-toastify`
- **Authentication & Database Adapter:** `better-auth`, `mongodb`
- **Data Visualization & Payments:** Charting library for Owner/Admin analytics, `@stripe/stripe-js` / Stripe Checkout integration

---

## Environment Variables

Create a `.env.local` file in the root of `equipment-rental-client` and configure the following variables:

```env
# Public App & API URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# BetterAuth & Database
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_32_character_minimum_secret_key
MONGODB_URI=your_mongodb_connection_string
DB_NAME=equipment_rental

# Social OAuth Providers (Optional / Production)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Third-Party Services
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akashonline24hour/equipment-rental-client.git
   cd equipment-rental-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` (or create `.env.local`) and fill in the required keys listed above.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.