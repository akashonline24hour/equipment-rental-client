# RentGear: Equipment Rental Platform

RentGear is a rental marketplace where **equipment owners** list their equipment and **customers** browse, book and pay for it online for a specific period. An **admin** reviews every listing, manages users and monitors all rentals.

|                          |                                                              |
| ------------------------ | ------------------------------------------------------------ |
| 🌐 **Live site**         | https://equipment-rental-client-rho.vercel.app               |
| 💻 **Client repository** | https://github.com/akashonline24hour/equipment-rental-client |
| ⚙️ **Server repository** | https://github.com/akashonline24hour/equipment-rental-server |
| 🔌 **Live API**          | https://equipment-rental-server-lake.vercel.app              |

> The admin email and password are provided in the assignment submission form.

---

## ✨ Key Features

**For everyone**

- A home page with an animated banner, featured equipment, categories, why choose us, customer reviews, how it works and trusted owners (Framer Motion).
- An **All Equipment** page with **server-side** search (name, category, brand, location), filters (category, rental type, price range, availability), sorting and pagination.
- Light and dark themes that follow the device setting, a responsive layout, and custom loading, error and 404 pages.

**Authentication and security**

- Email and password registration with a name, a photo (link or image upload) and password rules (an uppercase letter, a lowercase letter and at least 6 characters), plus **Google** and **GitHub** login. Success and error messages appear as toasts.
- Every new account starts as a **customer**. Choosing **owner** or **admin** at registration sends a request that an admin must approve.
- **JWT** authentication: the client gets a short-lived token from Better Auth and sends it to the API, which verifies it.
- **Role-based access control** for customers, owners and admins, with private routes protected in `proxy.ts`. A logged-in user stays on a private page when it is reloaded.

**Customers**

- A private equipment details page with the full description, specifications, rental terms and owner information.
- **Favorites**: add and remove equipment, saved in the database.
- A **booking modal** with start and end date, quantity, contact number, delivery address and notes, a live total and an availability check.
- **Stripe Checkout** payment, a payment success page, and a booking and payment record created after the payment succeeds.
- Dashboard: My Rentals, Favorites and Profile.

**Owners**

- Add equipment with an image upload (imgbb). New listings start as **pending**.
- My Equipment with search, status filters, update, delete and view, and a table that becomes cards on phones.
- My Equipment Rental (rentals of their equipment) and a profile page.

**Admins**

- All Users: change roles, approve or reject owner and admin requests, and block or unblock users.
- All Equipment: approve, reject, update and delete any listing.
- All Rentals: monitor every rental and payment, and a profile page.

---

## 🧰 Tech Stack and npm Packages

| Package                        | Purpose                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- |
| `next` (16, App Router)        | Framework, routing, server components, `proxy.ts` route protection          |
| `react`, `react-dom`           | UI library                                                                  |
| `typescript`                   | Type safety                                                                 |
| `tailwindcss`                  | Styling                                                                     |
| `daisyui`                      | UI component library and the light and dark themes                          |
| `better-auth`                  | Authentication: email and password, Google and GitHub, sessions, JWT plugin |
| `mongodb`                      | MongoDB driver used by Better Auth's database adapter                       |
| `framer-motion`                | Home page animations                                                        |
| `lucide-react`, `react-icons`  | Icons                                                                       |
| `react-toastify`               | Success and error toasts                                                    |
| `recharts`                     | Charts on the dashboards                                                    |
| `eslint`, `eslint-config-next` | Linting                                                                     |

**Services:** MongoDB Atlas (database), Stripe (payments, test mode), imgbb (image upload), Vercel (hosting).

---

## 🗺️ Pages

| Route                                 | Access                                        |
| ------------------------------------- | --------------------------------------------- |
| `/`                                   | Public                                        |
| `/equipment`                          | Public (search, filters, sorting, pagination) |
| `/equipment/[id]`                     | Private (logged-in users)                     |
| `/login`, `/register`                 | Logged-out users only                         |
| `/payment/success`, `/payment/cancel` | Private                                       |
| `/dashboard` and its sections         | Private, by role (customer, owner or admin)   |

---

## 🚀 Run It Locally

**Requirements:** Node.js 20.9 or newer, a MongoDB database, and the [server](https://github.com/akashonline24hour/equipment-rental-server) running.

```bash
git clone https://github.com/akashonline24hour/equipment-rental-client.git
cd equipment-rental-client
npm install
```

Create a `.env.local` file in the project root (never commit it):

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Database and Better Auth (use the same database as the server)
MONGODB_URI=
DB_NAME=equipment_rental
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Social login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Image upload (imgbb)
IMGBB_API_KEY=
```

Then start the app:

```bash
npm run dev      # development at http://localhost:3000
npm run build    # production build
npm run start    # run the production build
```

**Social login callback URLs:** `http://localhost:3000/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/github`.

### Try a payment

Payments run in Stripe **test mode**. Use the card `4242 4242 4242 4242`, any future expiry date, any 3-digit CVC and any ZIP.

---

## 📁 Project Structure

```
src/
├── app/            # Pages (App Router): home, equipment, auth, dashboard, payment, API routes
├── components/     # Layout, home sections, equipment, dashboard and UI components
├── lib/            # Auth setup, API helper, formatters, pricing and validators
└── types/          # TypeScript types
proxy.ts            # Route protection by login and role
```

---

## ☁️ Deployment

Deployed on **Vercel**. Set the same environment variables in the project settings, with production values:

- `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` are the live client address.
- `NEXT_PUBLIC_API_URL` is the live server address followed by `/api`.
- Add the production callback addresses to the Google and GitHub OAuth apps.

The server's `AUTH_URL` must be exactly the same address as `BETTER_AUTH_URL`.

---

## 👨‍💻 Author

Built by [akashonline24hour](https://github.com/akashonline24hour).
