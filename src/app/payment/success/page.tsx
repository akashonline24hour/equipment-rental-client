"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import { formatDay, formatPrice } from "@/lib/format";
import type { Booking } from "@/types/booking";

type State =
  | { status: "loading" }
  | { status: "success"; booking: Booking }
  | { status: "error"; message: string };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-10">
      <div className="card w-full border border-base-300 bg-base-100">
        <div className="card-body items-center gap-4 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    // Safe to run twice: the server creates only one booking per payment
    apiFetch<{ booking: Booking }>("/bookings/confirm", {
      method: "POST",
      body: { sessionId },
    })
      .then(({ booking }) => {
        if (!cancelled) setState({ status: "success", booking });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          status: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "We could not confirm your payment.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <Shell>
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
          <TriangleAlert size={32} />
        </span>
        <h1 className="text-2xl font-extrabold">Missing payment information</h1>
        <Link href="/equipment" className="btn btn-primary">
          Browse equipment
        </Link>
      </Shell>
    );
  }

  if (state.status === "loading") {
    return (
      <Shell>
        <span className="loading loading-spinner loading-lg text-primary" />
        <h1 className="text-xl font-bold">Confirming your payment...</h1>
        <p className="text-sm text-base-content/70">
          Please do not close this page.
        </p>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell>
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
          <TriangleAlert size={32} />
        </span>
        <h1 className="text-2xl font-extrabold">
          We could not complete your booking
        </h1>
        <p className="text-sm text-base-content/70">{state.message}</p>
        <Link href="/equipment" className="btn btn-primary">
          Browse equipment
        </Link>
      </Shell>
    );
  }

  const { booking } = state;
  const rows = [
    { label: "Equipment", value: booking.equipmentName },
    {
      label: "Rental period",
      value: `${formatDay(booking.startDate)} to ${formatDay(booking.endDate)}`,
    },
    { label: "Quantity", value: String(booking.quantity) },
    { label: "Amount paid", value: formatPrice(booking.totalAmount) },
    { label: "Booking status", value: booking.status },
  ];

  return (
    <Shell>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={34} />
      </span>
      <h1 className="text-2xl font-extrabold">Payment successful</h1>
      <p className="text-sm text-base-content/70">
        Your booking is confirmed. The owner will contact you on{" "}
        {booking.contactNumber}.
      </p>

      <dl className="w-full space-y-2 rounded-box bg-base-200 p-4 text-left text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-base-content/70">{row.label}</dt>
            <dd className="text-right font-semibold capitalize">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap justify-center gap-2 pt-1">
        <Link href="/dashboard/customer/rentals" className="btn btn-primary">
          View my rentals
        </Link>
        <Link href="/equipment" className="btn btn-outline">
          Browse more
        </Link>
      </div>
    </Shell>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
