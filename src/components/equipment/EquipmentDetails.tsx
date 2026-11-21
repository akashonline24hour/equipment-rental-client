"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  SearchX,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ApiError, apiFetch } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";
import { availableUnits } from "@/lib/equipment";
import { RENTAL_UNIT, formatPrice } from "@/lib/format";
import type { Equipment } from "@/types/equipment";
import DetailsActions from "@/components/equipment/DetailsActions";
import EquipmentDetailsSkeleton from "@/components/equipment/EquipmentDetailsSkeleton";
import UserAvatar from "@/components/layout/UserAvatar";
import StatusBadge from "@/components/ui/StatusBadge";

type LoadError = { message: string; notFound: boolean };

const TRUST_POINTS = [
  { icon: BadgeCheck, text: "Listed by a verified owner" },
  { icon: ShieldCheck, text: "Secure online payment with Stripe" },
  { icon: CalendarClock, text: "Flexible rental periods" },
];

export default function EquipmentDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [item, setItem] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LoadError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Equipment>(`/equipment/${id}`)
      .then((data) => {
        if (cancelled) return;
        setItem(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;

        if (err instanceof ApiError && err.status === 401) {
          router.replace(
            `/login?redirect=${encodeURIComponent(`/equipment/${id}`)}`,
          );
          return;
        }
        setError({
          message:
            err instanceof ApiError
              ? err.message
              : "Could not load this equipment.",
          notFound:
            err instanceof ApiError &&
            (err.status === 404 || err.status === 400),
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey, router]);

  // Show the equipment name in the browser tab
  useEffect(() => {
    if (item?.name) document.title = `${item.name} | ${SITE_NAME}`;
  }, [item?.name]);

  function retry() {
    setError(null);
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  if (loading) return <EquipmentDetailsSkeleton />;

  if (error || !item) {
    const notFound = error?.notFound ?? false;
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4">
        <div className="card w-full border border-base-300 bg-base-100">
          <div className="card-body items-center gap-3 text-center">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                notFound
                  ? "bg-base-200 text-base-content/60"
                  : "bg-error/10 text-error"
              }`}
            >
              {notFound ? <SearchX size={28} /> : <TriangleAlert size={28} />}
            </span>
            <h1 className="text-xl font-bold">
              {notFound ? "Equipment not found" : "Could not load equipment"}
            </h1>
            <p className="text-sm text-base-content/70">
              {notFound
                ? "This equipment does not exist, or it is not available to view."
                : error?.message}
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {!notFound && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={retry}
                >
                  Try again
                </button>
              )}
              <Link href="/equipment" className="btn btn-outline btn-sm">
                Browse all equipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const units = availableUnits(item);
  const available = units > 0;
  const isOwnItem = item.ownerId === session?.user.id;

  const specs = [
    { label: "Category", value: item.category },
    { label: "Brand", value: item.brand },
    { label: "Model", value: item.model },
    { label: "Condition", value: item.condition },
    { label: "Rental type", value: item.rentalType },
    { label: "Location", value: item.location },
    { label: "Total units", value: String(item.quantity) },
    { label: "Available now", value: String(units) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="breadcrumbs mb-4 text-sm">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/equipment">All equipment</Link>
          </li>
          <li className="max-w-[12rem] truncate sm:max-w-xs">{item.name}</li>
        </ul>
      </div>

      <header className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-outline">{item.category}</span>
          {item.status !== "approved" && <StatusBadge status={item.status} />}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {item.name}
        </h1>
        <p className="flex items-center gap-1.5 text-base-content/70">
          <MapPin size={16} className="shrink-0" />
          {item.location}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Left column */}
        <div className="min-w-0 space-y-6">
          <figure className="overflow-hidden rounded-box border border-base-300 bg-base-300">
            <div className="aspect-[4/3] sm:aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>
          </figure>

          <section className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3">
              <h2 className="card-title text-lg">About this equipment</h2>
              <p className="whitespace-pre-line leading-relaxed text-base-content/80">
                {item.description}
              </p>
            </div>
          </section>

          <section className="card border border-base-300 bg-base-100">
            <div className="card-body gap-4">
              <h2 className="card-title text-lg">Specifications</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="min-w-0">
                    <dt className="text-xs uppercase tracking-wider text-base-content/60">
                      {spec.label}
                    </dt>
                    <dd className="mt-0.5 break-words font-semibold">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3">
              <h2 className="card-title text-lg">
                Rental terms and conditions
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-base-content/80">
                {item.terms}
              </p>
            </div>
          </section>

          <section className="card border border-base-300 bg-base-100">
            <div className="card-body gap-4">
              <h2 className="card-title text-lg">Owner information</h2>
              <div className="flex items-center gap-4">
                <UserAvatar
                  key={item.ownerImage || "no-photo"}
                  name={item.ownerName}
                  image={item.ownerImage}
                  size={56}
                />
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-base font-bold">
                    {item.ownerName}
                  </p>
                  {item.ownerPhone && (
                    <a
                      href={`tel:${item.ownerPhone.replace(/[^+\d]/g, "")}`}
                      className="flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content"
                    >
                      <Phone size={14} className="shrink-0" />
                      {item.ownerPhone}
                    </a>
                  )}
                  {item.ownerEmail && (
                    <a
                      href={`mailto:${item.ownerEmail}`}
                      className="flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content"
                    >
                      <Mail size={14} className="shrink-0" />
                      <span className="truncate">{item.ownerEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <aside className="lg:sticky lg:top-24">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-5">
              <div>
                <p className="text-3xl font-extrabold">
                  {formatPrice(item.price)}{" "}
                  <span className="text-base font-normal text-base-content/60">
                    / {RENTAL_UNIT[item.rentalType] ?? item.rentalType}
                  </span>
                </p>
                <p className="mt-1 text-sm text-base-content/60">
                  {item.rentalType} rental
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-box bg-base-200 px-4 py-3">
                <span
                  className={`badge ${available ? "badge-success" : "badge-error"}`}
                >
                  {available ? "Available" : "Unavailable"}
                </span>
                <span className="text-sm text-base-content/70">
                  {available
                    ? `${units} of ${item.quantity} units free`
                    : "Currently rented out"}
                </span>
              </div>

              <DetailsActions
                item={item}
                role={session?.user.role}
                isOwnItem={isOwnItem}
              />

              <ul className="space-y-3 border-t border-base-300 pt-4">
                {TRUST_POINTS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base-content">
                      <Icon size={16} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
