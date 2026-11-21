"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ApiError, apiFetch } from "@/lib/api";
import type { Equipment } from "@/types/equipment";
import EquipmentForm from "@/components/dashboard/EquipmentForm";

function Notice({
  title,
  text,
  backHref,
  backLabel,
}: {
  title: string;
  text: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="card mx-auto max-w-md border border-base-300 bg-base-100">
      <div className="card-body items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
          <TriangleAlert size={28} />
        </span>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-base-content/70">{text}</p>
        <Link href={backHref} className="btn btn-primary btn-sm">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

export default function EditEquipment({
  id,
  admin = false,
}: {
  id: string;
  admin?: boolean;
}) {
  const backHref = admin
    ? "/dashboard/admin/equipment"
    : "/dashboard/owner/equipment";
  const backLabel = admin ? "Back to all equipment" : "Back to my equipment";

  const { data: session, isPending } = authClient.useSession();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Equipment>(`/equipment/${id}`)
      .then((data) => {
        if (!cancelled) setEquipment(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError && err.status === 404
            ? "This equipment could not be found."
            : err instanceof ApiError
              ? err.message
              : "Could not load this equipment.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || isPending) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-72 w-full" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <Notice
        title="Equipment unavailable"
        text={error || "Something went wrong."}
        backHref={backHref}
        backLabel={backLabel}
      />
    );
  }

  // Owners may only edit their own items. The server enforces this as well.
  if (!admin && equipment.ownerId !== session?.user.id) {
    return (
      <Notice
        title="Not your equipment"
        text="You can only edit equipment that you listed."
        backHref={backHref}
        backLabel={backLabel}
      />
    );
  }

  return (
    <EquipmentForm mode="edit" equipment={equipment} backHref={backHref} />
  );
}
