"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { ApiError, apiFetch } from "@/lib/api";

export default function FavoriteButton({
  equipmentId,
}: {
  equipmentId: string;
}) {
  const [favorite, setFavorite] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<string[]>("/favorites/ids")
      .then((ids) => {
        if (!cancelled) setFavorite(ids.includes(equipmentId));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [equipmentId]);

  async function toggle() {
    setBusy(true);
    try {
      if (favorite) {
        const result = await apiFetch<{ message: string }>(
          `/favorites/${equipmentId}`,
          { method: "DELETE" },
        );
        setFavorite(false);
        toast.success(result.message);
      } else {
        const result = await apiFetch<{ message: string }>("/favorites", {
          method: "POST",
          body: { equipmentId },
        });
        setFavorite(true);
        toast.success(result.message);
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not update favorites",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={`btn w-full ${favorite ? "btn-secondary" : "btn-outline"}`}
      onClick={toggle}
      disabled={!ready || busy}
      aria-pressed={favorite}
    >
      <Heart size={18} className={favorite ? "fill-current" : ""} />
      {favorite ? "Saved to favorites" : "Add to favorites"}
    </button>
  );
}
