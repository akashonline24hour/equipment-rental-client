"use client";

import Link from "next/link";
import { CalendarCheck, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { availableUnits } from "@/lib/equipment";
import type { Equipment } from "@/types/equipment";

export default function DetailsActions({
  item,
  role,
  isOwnItem,
}: {
  item: Equipment;
  role?: string | null;
  isOwnItem: boolean;
}) {
  // Only approved listings can be rented
  if (item.status !== "approved") {
    return (
      <div role="alert" className="alert alert-warning alert-soft text-sm">
        {item.status === "pending"
          ? "This listing is waiting for admin approval, so it is not open for rental yet."
          : "This listing was rejected, so it is not open for rental."}
      </div>
    );
  }

  // Only customers rent equipment
  if (role !== "customer") {
    return (
      <div role="alert" className="alert alert-info alert-soft text-sm">
        <div>
          <p>
            {isOwnItem ? "This is your listing. " : ""}
            Only customer accounts can rent equipment.
          </p>
          {isOwnItem && (
            <Link
              href="/dashboard/owner/equipment"
              className="link mt-1 inline-block font-semibold"
            >
              Manage your equipment
            </Link>
          )}
        </div>
      </div>
    );
  }

  const units = availableUnits(item);

  return (
    <div className="space-y-3">
      {/* Step 7 opens the booking modal here */}
      <button
        type="button"
        className="btn btn-primary btn-lg w-full"
        disabled={units <= 0}
        onClick={() => toast.info("Booking is added in the next steps")}
      >
        <CalendarCheck size={18} />
        {units > 0 ? "Book now" : "Currently unavailable"}
      </button>

      {/* Step 6 saves favorites here */}
      <button
        type="button"
        className="btn btn-outline w-full"
        onClick={() => toast.info("Favorites are added in the next steps")}
      >
        <Heart size={18} /> Add to favorites
      </button>
    </div>
  );
}
