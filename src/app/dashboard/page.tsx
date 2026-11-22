"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  DollarSign,
  Heart,
  Package,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import UserAvatar from "@/components/layout/UserAvatar";

type BookingSummary = {
  totalAmount?: number;
  totalCents?: number;
  paymentStatus?: string;
};

function resolveBookingAmount(booking: BookingSummary): number {
  if (typeof booking.totalAmount === "number") return booking.totalAmount;
  if (typeof booking.totalCents === "number") return booking.totalCents / 100;
  return 0;
}

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [rentalsCount, setRentalsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [ownedCount, setOwnedCount] = useState(0);
  const [ownerBookings, setOwnerBookings] = useState<BookingSummary[]>([]);

  const [usersCount, setUsersCount] = useState(0);
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [allRentalsCount, setAllRentalsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;

    if (user.role === "admin") {
      Promise.allSettled([
        apiFetch<unknown[]>("/admin/users"),
        apiFetch<unknown[]>("/admin/equipment"),
        apiFetch<unknown[]>("/bookings/all"),
      ]).then(([usersRes, eqRes, bookingsRes]) => {
        if (!active) return;
        if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
          setUsersCount(usersRes.value.length);
        }
        if (eqRes.status === "fulfilled" && Array.isArray(eqRes.value)) {
          setEquipmentCount(eqRes.value.length);
        }
        if (
          bookingsRes.status === "fulfilled" &&
          Array.isArray(bookingsRes.value)
        ) {
          setAllRentalsCount(bookingsRes.value.length);
        }
      });
    } else if (user.role === "owner") {
      Promise.allSettled([
        apiFetch<unknown[]>("/equipment/mine"),
        apiFetch<BookingSummary[]>("/bookings/owner"),
      ]).then(([eqRes, bookRes]) => {
        if (!active) return;
        if (eqRes.status === "fulfilled" && Array.isArray(eqRes.value)) {
          setOwnedCount(eqRes.value.length);
        }
        if (bookRes.status === "fulfilled" && Array.isArray(bookRes.value)) {
          setOwnerBookings(bookRes.value);
        }
      });
    } else {
      Promise.allSettled([
        apiFetch<unknown[]>("/bookings/mine"),
        apiFetch<string[]>("/favorites/ids"),
      ]).then(([rentalsRes, favsRes]) => {
        if (!active) return;
        if (
          rentalsRes.status === "fulfilled" &&
          Array.isArray(rentalsRes.value)
        ) {
          setRentalsCount(rentalsRes.value.length);
        }
        if (favsRes.status === "fulfilled" && Array.isArray(favsRes.value)) {
          setFavoritesCount(favsRes.value.length);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [user]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="skeleton h-48 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-28 w-full" />
          <div className="skeleton h-28 w-full" />
          <div className="skeleton h-28 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const pending = user.roleRequestStatus === "pending";
  const paidEarnings = ownerBookings
    .filter((b) => !b.paymentStatus || b.paymentStatus === "paid")
    .reduce((sum, b) => sum + resolveBookingAmount(b), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-5">
          <div className="flex items-center gap-4">
            <UserAvatar
              key={user.image || user.email}
              name={user.name}
              image={user.image}
              size={64}
            />
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold">{user.name}</h1>
              <p className="truncate text-sm text-base-content/70">
                {user.email}
              </p>
            </div>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-base-content/60">
                Current role
              </dt>
              <dd className="font-bold capitalize">{user.role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-base-content/60">
                Requested role
              </dt>
              <dd className="font-bold capitalize">{user.requestedRole}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-base-content/60">
                Request status
              </dt>
              <dd className="font-bold capitalize">{user.roleRequestStatus}</dd>
            </div>
          </dl>

          {pending && (
            <div role="alert" className="alert alert-info alert-soft text-sm">
              Your {user.requestedRole} request is waiting for admin approval.
              Until then you can use RentGear as a customer.
            </div>
          )}
        </div>
      </div>

      {user.role === "admin" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/admin/users"
            className="card border border-base-300 bg-base-100 transition-colors hover:border-primary"
          >
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Users size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    All Users
                  </p>
                  <p className="text-2xl font-extrabold">{usersCount}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-base-content/50" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/equipment"
            className="card border border-base-300 bg-base-100 transition-colors hover:border-primary"
          >
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Package size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    All Equipment
                  </p>
                  <p className="text-2xl font-extrabold">{equipmentCount}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-base-content/50" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/rentals"
            className="card border border-base-300 bg-base-100 transition-colors hover:border-primary sm:col-span-2 lg:col-span-1"
          >
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
                  <ClipboardList size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    All Rentals
                  </p>
                  <p className="text-2xl font-extrabold">{allRentalsCount}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-base-content/50" />
            </div>
          </Link>
        </div>
      ) : user.role === "owner" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/owner/equipment"
            className="card border border-base-300 bg-base-100 transition-colors hover:border-primary"
          >
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Package size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    My Equipment
                  </p>
                  <p className="text-2xl font-extrabold">{ownedCount}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-base-content/50" />
            </div>
          </Link>

          <Link
            href="/dashboard/owner/rentals"
            className="card border border-base-300 bg-base-100 transition-colors hover:border-primary"
          >
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <ClipboardList size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    Equipment Rentals
                  </p>
                  <p className="text-2xl font-extrabold">
                    {ownerBookings.length}
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-base-content/50" />
            </div>
          </Link>

          <div className="card border border-base-300 bg-base-100 sm:col-span-2 lg:col-span-1">
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
                  <DollarSign size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-extrabold">
                    {formatPrice(paidEarnings)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/customer/rentals"
            className="card border border-base-300 bg-base-100 transition-colors hover:border-primary"
          >
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <CalendarClock size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    My Rentals
                  </p>
                  <p className="text-2xl font-extrabold">{rentalsCount}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-base-content/50" />
            </div>
          </Link>

          <Link
            href="/dashboard/customer/favorites"
            className="card border border-base-300 bg-base-100 transition-colors hover:border-primary"
          >
            <div className="card-body flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Heart size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-base-content/60">
                    Favorites
                  </p>
                  <p className="text-2xl font-extrabold">{favoritesCount}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-base-content/50" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
