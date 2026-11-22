"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { ApiError, apiFetch } from "@/lib/api";
import { availableUnits } from "@/lib/equipment";
import { formatPrice } from "@/lib/format";
import { countDays, priceBooking } from "@/lib/pricing";
import type { Equipment } from "@/types/equipment";

const MAX_DAYS = 365;
const PHONE_PATTERN = /^[+\d][\d\s\-()]{5,19}$/;
const UNIT_NAME: Record<string, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};

// The server uses the UTC date, so the calendar does as well
const todayUtc = () => new Date().toISOString().slice(0, 10);

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70";

export default function BookingModal({
  item,
  open,
  onClose,
}: {
  item: Equipment;
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = authClient.useSession();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [contact, setContact] = useState(session?.user.phone ?? "");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const available = availableUnits(item);
  const unitName = UNIT_NAME[item.rentalType] ?? "unit";
  const qty = Number(quantity);
  const days = startDate && endDate ? countDays(startDate, endDate) : 0;
  const pricing =
    days >= 1 && days <= MAX_DAYS && Number.isInteger(qty) && qty >= 1
      ? priceBooking({
          price: item.price,
          rentalType: item.rentalType,
          days,
          quantity: qty,
        })
      : null;

  function validate(): string | null {
    if (!startDate || !endDate) return "Choose the start and end dates";
    if (startDate < todayUtc()) return "The start date cannot be in the past";
    if (endDate < startDate)
      return "The end date must be on or after the start date";
    if (days > MAX_DAYS) return "You can rent for at most 365 days at a time";
    if (!Number.isInteger(qty) || qty < 1) return "Enter the quantity you need";
    if (qty > available)
      return `Only ${available} unit${available === 1 ? "" : "s"} available`;
    if (!PHONE_PATTERN.test(contact.trim()))
      return "Enter a valid contact number";
    if (address.trim().length < 5 || address.trim().length > 200)
      return "Enter the delivery address (5 to 200 characters)";
    if (notes.length > 300) return "Notes can be at most 300 characters";
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiFetch<{ url: string }>("/bookings/checkout", {
        method: "POST",
        body: {
          equipmentId: item._id,
          startDate,
          endDate,
          quantity: qty,
          contactNumber: contact.trim(),
          deliveryAddress: address.trim(),
          notes: notes.trim(),
        },
      });
      // Go to the Stripe payment page. The button stays disabled while the browser leaves.
      window.location.assign(result.url);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not start the payment",
      );
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="modal-box max-h-[92vh] w-full max-w-2xl overflow-y-auto">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="booking-title" className="text-xl font-extrabold">
              Book this equipment
            </h2>
            <p className="truncate text-sm text-base-content/70">{item.name}</p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close"
            onClick={onClose}
            disabled={submitting}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className={labelClass}>Rental start date</span>
              <input
                type="date"
                className="input w-full"
                min={todayUtc()}
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div>
              <span className={labelClass}>Rental end date</span>
              <input
                type="date"
                className="input w-full"
                min={startDate || todayUtc()}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <div>
              <span className={labelClass}>Required quantity</span>
              <input
                type="number"
                className="input w-full"
                min="1"
                max={Math.max(available, 1)}
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
              <p className="mt-1 text-xs text-base-content/60">
                {available} available
              </p>
            </div>
            <div>
              <span className={labelClass}>Contact number</span>
              <input
                type="tel"
                className="input w-full"
                placeholder="+880 1700-000000"
                autoComplete="tel"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
              />
            </div>
          </div>

          <div>
            <span className={labelClass}>Delivery address</span>
            <textarea
              className="textarea w-full"
              rows={2}
              placeholder="House, road, area and city"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>

          <div>
            <span className={labelClass}>Additional notes (optional)</span>
            <textarea
              className="textarea w-full"
              rows={2}
              maxLength={300}
              placeholder="Anything the owner should know"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-box bg-base-200 p-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-base-content/70">Rate</span>
              <span className="font-semibold">
                {formatPrice(item.price)} / {unitName}
              </span>
            </div>
            {pricing ? (
              <>
                <div className="flex justify-between gap-3">
                  <span className="text-base-content/70">Rental period</span>
                  <span className="text-right font-semibold">
                    {days} day{days === 1 ? "" : "s"} ({pricing.units}{" "}
                    {unitName}
                    {pricing.units === 1 ? "" : "s"} billed)
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-base-content/70">Quantity</span>
                  <span className="font-semibold">{qty}</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-base-300 pt-2 text-base font-extrabold">
                  <span>Total</span>
                  <span>{formatPrice(pricing.total)}</span>
                </div>
              </>
            ) : (
              <p className="text-base-content/60">
                Choose your dates and quantity to see the total.
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary sm:min-w-48"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Confirm and pay"
              )}
            </button>
          </div>
          <p className="text-center text-xs text-base-content/60">
            You will be taken to Stripe to pay securely. Nothing is booked until
            the payment succeeds.
          </p>
        </form>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />
    </div>
  );
}
