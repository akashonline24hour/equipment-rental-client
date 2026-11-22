"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { ApiError, apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

type OwnerRental = {
  _id: string;
  equipmentName: string;
  customerName?: string;
  customerEmail?: string;
  contactNumber?: string;
  deliveryAddress?: string;
  quantity?: number;
  days?: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  totalAmount?: number;
  totalCents?: number;
  paymentStatus?: string;
  bookingStatus?: string;
};

function getAmount(rental: OwnerRental): number {
  if (typeof rental.totalAmount === "number") return rental.totalAmount;
  if (typeof rental.totalCents === "number") return rental.totalCents / 100;
  return 0;
}

export default function MyEquipmentRentalPage() {
  const [rentals, setRentals] = useState<OwnerRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch<OwnerRental[]>("/bookings/owner")
      .then((data) => {
        if (active) {
          setRentals(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError ? err.message : "Could not load rentals.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const paidTotal = rentals
    .filter((r) => !r.paymentStatus || r.paymentStatus === "paid")
    .reduce((sum, r) => sum + getAmount(r), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Equipment Rental"
        description="Track customer reservations, rental dates, and revenue from your equipment."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body">
            <p className="text-xs uppercase tracking-wider text-base-content/60">
              Total Rentals
            </p>
            <p className="text-2xl font-extrabold">{rentals.length}</p>
          </div>
        </div>
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body">
            <p className="text-xs uppercase tracking-wider text-base-content/60">
              Total Revenue
            </p>
            <p className="text-2xl font-extrabold">{formatPrice(paidTotal)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="skeleton h-64 w-full" />
      ) : error ? (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      ) : rentals.length === 0 ? (
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body items-center text-center">
            <p className="font-semibold">No equipment rentals yet</p>
            <p className="text-sm text-base-content/70">
              Once customers book and pay for your approved equipment, their
              reservations will appear here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile & Tablet Cards (< lg) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {rentals.map((r) => (
              <article
                key={r._id}
                className="card border border-base-300 bg-base-100"
              >
                <div className="card-body gap-2.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold leading-snug">
                      {r.equipmentName}
                    </h2>
                    <span className="badge badge-sm shrink-0 capitalize">
                      {r.bookingStatus || "confirmed"}
                    </span>
                  </div>

                  <p className="text-xs text-base-content/70">
                    Renter: {r.customerName || r.customerEmail || "Customer"}
                  </p>
                  {r.contactNumber && (
                    <p className="text-xs text-base-content/70">
                      Phone: {r.contactNumber}
                    </p>
                  )}
                  <p className="text-xs text-base-content/70">
                    Dates: {formatDate(r.startDate)} – {formatDate(r.endDate)}
                    {typeof r.quantity === "number"
                      ? ` (Qty: ${r.quantity})`
                      : ""}
                  </p>

                  <div className="mt-1 flex items-center justify-between border-t border-base-300 pt-2">
                    <span className="text-base font-extrabold">
                      {formatPrice(getAmount(r))}
                    </span>
                    <span className="badge badge-outline badge-sm capitalize">
                      {r.paymentStatus || "paid"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop Table (lg+) */}
          <div className="hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 lg:block">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment Name</th>
                  <th>Renter</th>
                  <th>Rental Period</th>
                  <th>Qty</th>
                  <th>Booked On</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr key={r._id}>
                    <td className="font-semibold">{r.equipmentName}</td>
                    <td>
                      <p className="font-medium">
                        {r.customerName || "Customer"}
                      </p>
                      <p className="text-xs text-base-content/60">
                        {r.contactNumber || r.customerEmail || ""}
                      </p>
                    </td>
                    <td>
                      {formatDate(r.startDate)} – {formatDate(r.endDate)}
                    </td>
                    <td>{r.quantity ?? 1}</td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td className="font-bold">{formatPrice(getAmount(r))}</td>
                    <td>
                      <span className="badge badge-outline badge-sm capitalize">
                        {r.paymentStatus || "paid"}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-sm capitalize">
                        {r.bookingStatus || "confirmed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
