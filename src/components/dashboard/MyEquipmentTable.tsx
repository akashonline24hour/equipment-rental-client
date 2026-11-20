"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, PackagePlus, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";
import { ApiError, apiFetch } from "@/lib/api";
import { RENTAL_UNIT, formatPrice } from "@/lib/format";
import type { Equipment } from "@/types/equipment";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusBadge from "@/components/ui/StatusBadge";

export default function MyEquipmentTable() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

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
      <div className="space-y-3">
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
    <>
      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
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
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg bg-base-300 object-cover"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="max-w-56 truncate font-semibold">
                        {item.name}
                      </p>
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
                <td className="text-sm">{item.quantity}</td>
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
                      onClick={() => setToDelete(item)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this equipment?"
        message={`"${toDelete?.name ?? ""}" will be removed permanently. This cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
