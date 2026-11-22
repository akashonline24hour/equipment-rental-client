"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { ApiError, apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

type RentalBooking = {
  _id: string;
  equipmentName: string;
  equipmentId?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
};

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<RentalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch<RentalBooking[]>("/bookings/mine")
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Rentals"
        description="View your rental bookings, dates, payment status, and current booking status."
        action={
          <Link href="/equipment" className="btn btn-primary btn-sm">
            Browse Equipment
          </Link>
        }
      />

      {loading ? (
        <div className="skeleton h-64 w-full" />
      ) : error ? (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      ) : rentals.length === 0 ? (
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body items-center text-center">
            <p className="font-semibold">No rental bookings yet</p>
            <p className="text-sm text-base-content/70">
              Once you book equipment and complete payment, your rentals will
              appear here.
            </p>
            <Link href="/equipment" className="btn btn-primary btn-sm mt-2">
              Find Equipment to Rent
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Rental Start Date</th>
                <th>Rental End Date</th>
                <th>Booking Date</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((item) => (
                <tr key={item._id}>
                  <td className="font-semibold">{item.equipmentName}</td>
                  <td>{formatDate(item.startDate)}</td>
                  <td>{formatDate(item.endDate)}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td className="font-bold">{formatPrice(item.totalAmount)}</td>
                  <td>
                    <span className="badge badge-outline badge-sm capitalize">
                      {item.paymentStatus || "pending"}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-sm capitalize">
                      {item.bookingStatus || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
