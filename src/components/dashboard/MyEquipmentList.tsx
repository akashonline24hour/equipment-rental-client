"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import {
  Eye,
  LayoutGrid,
  MapPin,
  PackagePlus,
  Pencil,
  Search,
  SearchX,
  Table as TableIcon,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { ApiError, apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { RENTAL_UNIT, formatPrice } from "@/lib/format";
import type { Equipment, EquipmentStatus } from "@/types/equipment";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusBadge from "@/components/ui/StatusBadge";

type StatusFilter = "all" | EquipmentStatus;
type SortKey = "newest" | "oldest" | "price-low" | "price-high" | "name";
type View = "table" | "cards";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.visibility = "hidden";
}

const time = (value: string) => new Date(value).getTime();

function sortItems(items: Equipment[], sort: SortKey): Equipment[] {
  const copy = [...items];
  switch (sort) {
    case "oldest":
      return copy.sort((a, b) => time(a.createdAt) - time(b.createdAt));
    case "price-low":
      return copy.sort((a, b) => a.price - b.price);
    case "price-high":
      return copy.sort((a, b) => b.price - a.price);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy.sort((a, b) => time(b.createdAt) - time(a.createdAt));
  }
}

// ---------- table row (desktop) ----------
function EquipmentRow({
  item,
  onDelete,
}: {
  item: Equipment;
  onDelete: (item: Equipment) => void;
}) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg bg-base-300 object-cover"
            onError={hideBrokenImage}
          />
          <div className="min-w-0">
            <p className="max-w-56 truncate font-semibold">{item.name}</p>
            <p className="max-w-56 truncate text-xs text-base-content/60">
              {item.brand} {item.model}
            </p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap text-sm">{item.category}</td>
      <td className="whitespace-nowrap text-sm font-semibold">
        {formatPrice(item.price)}{" "}
        <span className="font-normal text-base-content/60">
          / {RENTAL_UNIT[item.rentalType] ?? item.rentalType}
        </span>
      </td>
      <td className="text-sm">
        {item.availableQuantity ?? item.quantity}{" "}
        <span className="text-base-content/50">/ {item.quantity}</span>
      </td>
      <td>
        <StatusBadge status={item.status} />
        {item.status === "rejected" && (
          <p className="mt-1 text-xs text-error">
            Edit to send it for review again
          </p>
        )}
      </td>
      <td>
        <div className="flex justify-end gap-1">
          <Link
            href={`/equipment/${item._id}`}
            className="btn btn-ghost btn-sm btn-square"
            aria-label={`View ${item.name}`}
            title="View details"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/dashboard/owner/equipment/${item._id}/edit`}
            className="btn btn-ghost btn-sm btn-square"
            aria-label={`Update ${item.name}`}
            title="Update"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square text-error"
            aria-label={`Delete ${item.name}`}
            title="Delete"
            onClick={() => onDelete(item)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ---------- card (phones, and the optional cards view) ----------
function EquipmentCard({
  item,
  onDelete,
}: {
  item: Equipment;
  onDelete: (item: Equipment) => void;
}) {
  return (
    <article className="card h-full overflow-hidden border border-base-300 bg-base-100">
      <figure className="relative aspect-[4/3] w-full bg-base-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          onError={hideBrokenImage}
        />
        <span className="absolute left-3 top-3">
          <StatusBadge status={item.status} />
        </span>
      </figure>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
            {item.category}
          </p>
          <h3 className="line-clamp-2 text-base font-bold leading-snug">
            {item.name}
          </h3>
          <p className="truncate text-xs text-base-content/60">
            {item.brand} {item.model} · {item.condition}
          </p>
        </div>

        <p className="flex min-w-0 items-center gap-1.5 text-sm text-base-content/70">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{item.location}</span>
        </p>

        <div className="flex items-end justify-between gap-2">
          <p className="text-lg font-extrabold">
            {formatPrice(item.price)}{" "}
            <span className="text-xs font-normal text-base-content/60">
              / {RENTAL_UNIT[item.rentalType] ?? item.rentalType}
            </span>
          </p>
          <span className="text-xs text-base-content/60">
            Qty {item.quantity}
          </span>
        </div>

        {item.status === "rejected" && (
          <p className="text-xs text-error">
            Rejected. Edit it to send it for review again.
          </p>
        )}

        <div className="mt-auto grid grid-cols-[1fr_1fr_auto] gap-2 pt-1">
          <Link
            href={`/equipment/${item._id}`}
            className="btn btn-outline btn-sm"
          >
            <Eye size={15} /> View
          </Link>
          <Link
            href={`/dashboard/owner/equipment/${item._id}/edit`}
            className="btn btn-primary btn-sm"
          >
            <Pencil size={15} /> Update
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square text-error"
            aria-label={`Delete ${item.name}`}
            title="Delete"
            onClick={() => onDelete(item)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ---------- the list ----------
export default function MyEquipmentList() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<View>("table");

  const [toDelete, setToDelete] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Equipment[]>("/equipment/mine")
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not load your equipment",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const counts = useMemo<Record<StatusFilter, number>>(
    () => ({
      all: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      approved: items.filter((item) => item.status === "approved").length,
      rejected: items.filter((item) => item.status === "rejected").length,
    }),
    [items],
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (category !== "all" && item.category !== category) return false;
      if (!query) return true;
      return [item.name, item.brand, item.model, item.location].some((field) =>
        field.toLowerCase().includes(query),
      );
    });
    return sortItems(filtered, sort);
  }, [items, search, status, category, sort]);

  const filtersActive =
    search.trim() !== "" || status !== "all" || category !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
  }

  function retry() {
    setError("");
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  async function confirmDelete() {
    if (!toDelete) return;

    setDeleting(true);
    try {
      const result = await apiFetch<{ message: string }>(
        `/equipment/${toDelete._id}`,
        { method: "DELETE" },
      );
      setItems((previous) =>
        previous.filter((item) => item._id !== toDelete._id),
      );
      toast.success(result.message);
      setToDelete(null);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Could not delete the equipment",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div key={card} className="skeleton h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mx-auto max-w-md border border-error/30 bg-base-100">
        <div className="card-body items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
            <TriangleAlert size={28} />
          </span>
          <h2 className="text-lg font-bold">Could not load equipment</h2>
          <p className="text-sm text-base-content/70">{error}</p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card mx-auto max-w-md border border-base-300 bg-base-100">
        <div className="card-body items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-base-content">
            <PackagePlus size={28} />
          </span>
          <h2 className="text-lg font-bold">No equipment yet</h2>
          <p className="text-sm text-base-content/70">
            Add your first item and it will appear here once you submit it.
          </p>
          <Link
            href="/dashboard/owner/add-equipment"
            className="btn btn-primary btn-sm"
          >
            Add equipment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search, category, sort and view toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="input w-full lg:max-w-sm">
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            className="grow"
            placeholder="Search name, brand, model or location"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={14} />
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
          <select
            className="select min-w-0 flex-1 lg:w-52 lg:flex-none"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className="select min-w-0 flex-1 lg:w-48 lg:flex-none"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="Sort equipment"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Phones always show cards, so the toggle only appears from tablet width up */}
          <div className="join hidden md:inline-flex">
            <button
              type="button"
              className={`btn join-item btn-sm ${view === "table" ? "btn-primary" : "btn-ghost"}`}
              aria-pressed={view === "table"}
              aria-label="Table view"
              title="Table view"
              onClick={() => setView("table")}
            >
              <TableIcon size={16} />
            </button>
            <button
              type="button"
              className={`btn join-item btn-sm ${view === "cards" ? "btn-primary" : "btn-ghost"}`}
              aria-pressed={view === "cards"}
              aria-label="Card view"
              title="Card view"
              onClick={() => setView("cards")}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Status chips with counts */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => setStatus(tab.value)}
              className={`btn btn-sm shrink-0 rounded-full ${
                active ? "btn-primary" : "btn-ghost border border-base-300"
              }`}
            >
              {tab.label}
              <span className="badge badge-sm">{counts[tab.value]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-base-content/60">
        <span>
          Showing {visible.length} of {items.length}
        </span>
        {filtersActive && (
          <button
            type="button"
            className="link link-hover font-semibold text-secondary"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="card mx-auto max-w-md border border-base-300 bg-base-100">
          <div className="card-body items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-base-200 text-base-content/60">
              <SearchX size={28} />
            </span>
            <h2 className="text-lg font-bold">No equipment matches</h2>
            <p className="text-sm text-base-content/70">
              Try a different search or remove some filters.
            </p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Table: tablet and up, unless the cards view is chosen */}
          <div
            className={
              view === "table"
                ? "hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 md:block"
                : "hidden"
            }
          >
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Rental price</th>
                  <th>Available quantity</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <EquipmentRow
                    key={item._id}
                    item={item}
                    onDelete={setToDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards: always on phones, and on larger screens when chosen */}
          <div
            className={
              view === "cards"
                ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                : "grid gap-4 sm:grid-cols-2 md:hidden"
            }
          >
            {visible.map((item) => (
              <EquipmentCard
                key={item._id}
                item={item}
                onDelete={setToDelete}
              />
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this equipment?"
        message={`"${toDelete?.name ?? ""}" will be removed permanently. This cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
