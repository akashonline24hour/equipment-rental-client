"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import {
  Check,
  Eye,
  MapPin,
  Pencil,
  Search,
  SearchX,
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
type PendingAction = { kind: "reject" | "delete"; item: Equipment };

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

interface ItemProps {
  item: Equipment;
  busy: boolean;
  onApprove: (item: Equipment) => void;
  onReject: (item: Equipment) => void;
  onDelete: (item: Equipment) => void;
}

// ---------- icon buttons (table) ----------
function IconActions({ item, busy, onApprove, onReject, onDelete }: ItemProps) {
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {item.status !== "approved" && (
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square text-success"
          aria-label={`Approve ${item.name}`}
          title="Approve"
          disabled={busy}
          onClick={() => onApprove(item)}
        >
          <Check size={16} />
        </button>
      )}
      {item.status !== "rejected" && (
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square text-warning"
          aria-label={`Reject ${item.name}`}
          title="Reject"
          disabled={busy}
          onClick={() => onReject(item)}
        >
          <X size={16} />
        </button>
      )}
      <Link
        href={`/equipment/${item._id}`}
        className="btn btn-ghost btn-sm btn-square"
        aria-label={`View ${item.name}`}
        title="View details"
      >
        <Eye size={16} />
      </Link>
      <Link
        href={`/dashboard/admin/equipment/${item._id}/edit`}
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
        disabled={busy}
        onClick={() => onDelete(item)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// ---------- table row (tablet and up) ----------
function EquipmentRow(props: ItemProps) {
  const { item } = props;
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
            <p className="max-w-48 truncate font-semibold">{item.name}</p>
            <p className="max-w-48 truncate text-xs text-base-content/60">
              {item.brand} {item.model}
            </p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap text-sm">{item.category}</td>
      <td>
        <p className="max-w-40 truncate text-sm font-semibold">
          {item.ownerName}
        </p>
        <p className="max-w-40 truncate text-xs text-base-content/60">
          {item.ownerEmail}
        </p>
      </td>
      <td className="whitespace-nowrap text-sm font-semibold">
        {formatPrice(item.price)}{" "}
        <span className="font-normal text-base-content/60">
          / {RENTAL_UNIT[item.rentalType] ?? item.rentalType}
        </span>
      </td>
      <td className="text-sm">{item.quantity}</td>
      <td>
        <StatusBadge status={item.status} />
      </td>
      <td>
        <IconActions {...props} />
      </td>
    </tr>
  );
}

// ---------- card (phones) ----------
function EquipmentCard({
  item,
  busy,
  onApprove,
  onReject,
  onDelete,
}: ItemProps) {
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

        <div className="rounded-box bg-base-200 px-3 py-2 text-xs">
          <p className="truncate font-semibold">{item.ownerName}</p>
          <p className="truncate text-base-content/60">{item.ownerEmail}</p>
        </div>

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

        <div className="mt-auto space-y-2 pt-1">
          <div className="flex gap-2">
            {item.status !== "approved" && (
              <button
                type="button"
                className="btn btn-success btn-sm flex-1"
                disabled={busy}
                onClick={() => onApprove(item)}
              >
                <Check size={15} /> Approve
              </button>
            )}
            {item.status !== "rejected" && (
              <button
                type="button"
                className="btn btn-outline btn-warning btn-sm flex-1"
                disabled={busy}
                onClick={() => onReject(item)}
              >
                <X size={15} /> Reject
              </button>
            )}
          </div>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Link
              href={`/equipment/${item._id}`}
              className="btn btn-outline btn-sm"
            >
              <Eye size={15} /> View
            </Link>
            <Link
              href={`/dashboard/admin/equipment/${item._id}/edit`}
              className="btn btn-primary btn-sm"
            >
              <Pencil size={15} /> Update
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square text-error"
              aria-label={`Delete ${item.name}`}
              title="Delete"
              disabled={busy}
              onClick={() => onDelete(item)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ---------- the list ----------
export default function AdminEquipmentList() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const [busyId, setBusyId] = useState<string | null>(null);
  const [action, setAction] = useState<PendingAction | null>(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Equipment[]>("/admin/equipment")
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "Could not load equipment",
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
      return [
        item.name,
        item.brand,
        item.model,
        item.location,
        item.ownerName,
        item.ownerEmail,
      ].some((field) => field.toLowerCase().includes(query));
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

  // Returns true when the status was changed
  async function changeStatus(item: Equipment, next: EquipmentStatus) {
    setBusyId(item._id);
    try {
      const result = await apiFetch<{
        message: string;
        status: EquipmentStatus;
      }>(`/admin/equipment/${item._id}/status`, {
        method: "PATCH",
        body: { status: next },
      });
      setItems((previous) =>
        previous.map((entry) =>
          entry._id === item._id ? { ...entry, status: result.status } : entry,
        ),
      );
      toast.success(result.message);
      return true;
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not change the status",
      );
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function confirmAction() {
    if (!action) return;

    setActing(true);
    if (action.kind === "reject") {
      if (await changeStatus(action.item, "rejected")) setAction(null);
    } else {
      try {
        const result = await apiFetch<{ message: string }>(
          `/equipment/${action.item._id}`,
          { method: "DELETE" },
        );
        setItems((previous) =>
          previous.filter((entry) => entry._id !== action.item._id),
        );
        toast.success(result.message);
        setAction(null);
      } catch (err) {
        toast.error(
          err instanceof ApiError
            ? err.message
            : "Could not delete the equipment",
        );
      }
    }
    setActing(false);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-full" />
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="skeleton h-16 w-full" />
        ))}
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

  const dialogCopy = action
    ? action.kind === "reject"
      ? {
          title: "Reject this equipment?",
          message: `"${action.item.name}" will be rejected. The owner can edit it and send it for review again.`,
          confirmLabel: "Reject",
        }
      : {
          title: "Delete this equipment?",
          message: `"${action.item.name}" will be removed permanently. This cannot be undone.`,
          confirmLabel: "Delete",
        }
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="input w-full lg:max-w-sm">
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            className="grow"
            placeholder="Search equipment or owner"
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
        </div>
      </div>

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
            <h2 className="text-lg font-bold">
              {items.length === 0 ? "No equipment yet" : "No equipment matches"}
            </h2>
            <p className="text-sm text-base-content/70">
              {items.length === 0
                ? "Equipment listed by owners will appear here for review."
                : "Try a different search or remove some filters."}
            </p>
            {items.length > 0 && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 md:block">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Rental price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <EquipmentRow
                    key={item._id}
                    item={item}
                    busy={busyId === item._id}
                    onApprove={(entry) => changeStatus(entry, "approved")}
                    onReject={(entry) =>
                      setAction({ kind: "reject", item: entry })
                    }
                    onDelete={(entry) =>
                      setAction({ kind: "delete", item: entry })
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {visible.map((item) => (
              <EquipmentCard
                key={item._id}
                item={item}
                busy={busyId === item._id}
                onApprove={(entry) => changeStatus(entry, "approved")}
                onReject={(entry) => setAction({ kind: "reject", item: entry })}
                onDelete={(entry) => setAction({ kind: "delete", item: entry })}
              />
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={dialogCopy !== null}
        title={dialogCopy?.title ?? ""}
        message={dialogCopy?.message ?? ""}
        confirmLabel={dialogCopy?.confirmLabel}
        loading={acting}
        onConfirm={confirmAction}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
