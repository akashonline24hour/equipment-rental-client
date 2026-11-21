import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { availableUnits } from "@/lib/equipment";
import { RENTAL_UNIT, formatPrice } from "@/lib/format";
import type { PublicEquipment } from "@/types/equipment";

export default function EquipmentCard({ item }: { item: PublicEquipment }) {
  const units = availableUnits(item);
  const available = units > 0;

  return (
    <article className="card group h-full overflow-hidden border border-base-300 bg-base-100 transition-shadow duration-300 hover:shadow-lg">
      <figure className="relative aspect-[4/3] w-full overflow-hidden bg-base-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="badge badge-sm absolute left-3 top-3 border-0 bg-base-100/90 text-base-content">
          {item.category}
        </span>
        <span
          className={`badge badge-sm absolute right-3 top-3 border-0 ${
            available ? "badge-success" : "badge-error"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </figure>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[2.8rem] text-base font-bold leading-snug">
          {item.name}
        </h3>

        <p className="flex min-w-0 items-center gap-1.5 text-sm text-base-content/70">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{item.location}</span>
        </p>

        <div className="flex items-end justify-between gap-2">
          <p className="text-xl font-extrabold">
            {formatPrice(item.price)}{" "}
            <span className="text-xs font-normal text-base-content/60">
              / {RENTAL_UNIT[item.rentalType] ?? item.rentalType}
            </span>
          </p>
          <span className="badge badge-outline badge-sm">
            {item.rentalType}
          </span>
        </div>

        <p className="text-xs text-base-content/60">
          {available
            ? `${units} of ${item.quantity} units available`
            : "Currently rented out"}
        </p>

        <Link
          href={`/equipment/${item._id}`}
          className="btn btn-primary btn-block mt-auto"
        >
          View details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
