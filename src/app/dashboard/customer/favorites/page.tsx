"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, MapPin, Trash2 } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { ApiError, apiFetch } from "@/lib/api";
import { availableUnits } from "@/lib/equipment";
import { RENTAL_UNIT, formatPrice } from "@/lib/format";
import type { PublicEquipment } from "@/types/equipment";

type FavoriteRow = {
  favoriteId: string;
  savedAt: string;
  equipment: PublicEquipment;
};

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch<FavoriteRow[]>("/favorites")
      .then((data) => {
        if (active) {
          setFavorites(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError ? err.message : "Could not load favorites.",
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

  async function handleRemove(equipmentId: string) {
    setRemovingId(equipmentId);
    try {
      await apiFetch(`/favorites/${equipmentId}`, { method: "DELETE" });
      setFavorites((prev) =>
        prev.filter((row) => row.equipment._id !== equipmentId),
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to remove favorite.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Favorites"
        description="Equipment you saved for quick access later."
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          <div className="skeleton h-72 w-full" />
          <div className="skeleton h-72 w-full" />
        </div>
      ) : null}

      {loading ? (
        <div className="skeleton hidden h-64 w-full lg:block" />
      ) : error ? (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      ) : favorites.length === 0 ? (
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body items-center text-center">
            <p className="font-semibold">No favorite equipment yet</p>
            <p className="text-sm text-base-content/70">
              Save items from any equipment details page to find them here.
            </p>
            <Link href="/equipment" className="btn btn-primary btn-sm mt-2">
              Browse Equipment
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile & Tablet Card Grid (< lg) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {favorites.map(({ favoriteId, equipment }) => {
              const units = availableUnits(equipment);
              const isAvailable = units > 0;
              const isRemoving = removingId === equipment._id;

              return (
                <article
                  key={favoriteId}
                  className="card flex h-full flex-col overflow-hidden border border-base-300 bg-base-100"
                >
                  <figure className="relative aspect-[4/3] w-full overflow-hidden bg-base-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={equipment.image}
                      alt={equipment.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="badge badge-sm absolute left-3 top-3 border-0 bg-base-100/90 text-base-content">
                      {equipment.category}
                    </span>
                    <span
                      className={`badge badge-sm absolute right-3 top-3 border-0 ${
                        isAvailable ? "badge-success" : "badge-error"
                      }`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </figure>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <h2 className="line-clamp-2 text-base font-bold leading-snug">
                      {equipment.name}
                    </h2>

                    <p className="flex min-w-0 items-center gap-1.5 text-sm text-base-content/70">
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">{equipment.location}</span>
                    </p>

                    <p className="text-lg font-extrabold">
                      {formatPrice(equipment.price)}{" "}
                      <span className="text-xs font-normal text-base-content/60">
                        /{" "}
                        {RENTAL_UNIT[equipment.rentalType] ??
                          equipment.rentalType}
                      </span>
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      <Link
                        href={`/equipment/${equipment._id}`}
                        className="btn btn-outline btn-sm flex-1"
                      >
                        <ExternalLink size={14} />
                        View Details
                      </Link>
                      <button
                        type="button"
                        disabled={isRemoving}
                        onClick={() => handleRemove(equipment._id)}
                        className="btn btn-error btn-outline btn-sm flex-1"
                      >
                        <Trash2 size={14} />
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop Table (lg and up) */}
          <div className="hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 lg:block">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Rental Price</th>
                  <th>Availability</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map(({ favoriteId, equipment }) => {
                  const units = availableUnits(equipment);
                  const isRemoving = removingId === equipment._id;

                  return (
                    <tr key={favoriteId}>
                      <td>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={equipment.image}
                            alt={equipment.name}
                            className="h-12 w-12 shrink-0 rounded-lg bg-base-300 object-cover"
                          />
                          <span className="font-semibold">
                            {equipment.name}
                          </span>
                        </div>
                      </td>
                      <td>{equipment.category}</td>
                      <td>{equipment.location}</td>
                      <td className="font-bold">
                        {formatPrice(equipment.price)}{" "}
                        <span className="text-xs font-normal text-base-content/60">
                          /{" "}
                          {RENTAL_UNIT[equipment.rentalType] ??
                            equipment.rentalType}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            units > 0 ? "badge-success" : "badge-error"
                          }`}
                        >
                          {units > 0 ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/equipment/${equipment._id}`}
                            className="btn btn-outline btn-xs"
                          >
                            <ExternalLink size={14} />
                            View Details
                          </Link>
                          <button
                            type="button"
                            disabled={isRemoving}
                            onClick={() => handleRemove(equipment._id)}
                            className="btn btn-error btn-outline btn-xs"
                          >
                            <Trash2 size={14} />
                            {isRemoving ? "Removing..." : "Remove Favorite"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
