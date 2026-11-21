"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { CATEGORIES, RENTAL_TYPES } from "@/lib/constants";

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70";

export default function EquipmentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const category = searchParams.get("category") ?? "";
  const rentalType = searchParams.get("rentalType") ?? "";
  const availability = searchParams.get("availability") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const hasFilters = Boolean(
    searchParams.get("q") ||
    category ||
    rentalType ||
    availability ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice"),
  );

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page"); // a new search always starts on page 1

    const query = next.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  // Wait until the visitor stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      const unchanged =
        (searchParams.get("q") ?? "") === search.trim() &&
        (searchParams.get("minPrice") ?? "") === minPrice &&
        (searchParams.get("maxPrice") ?? "") === maxPrice;
      if (unchanged) return;
      update({ q: search.trim(), minPrice, maxPrice });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minPrice, maxPrice]);

  function clearAll() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body gap-4 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="input w-full">
            <Search size={16} className="opacity-50" />
            <input
              type="search"
              className="grow"
              placeholder="Search by name, category, brand or location"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              search && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-circle"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={14} />
                </button>
              )
            )}
          </label>

          <select
            className="select w-full lg:w-56"
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
            aria-label="Sort equipment"
          >
            <option value="newest">Recently added</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <span className={labelClass}>Category</span>
            <select
              className="select w-full"
              value={category}
              onChange={(event) => update({ category: event.target.value })}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClass}>Rental type</span>
            <select
              className="select w-full"
              value={rentalType}
              onChange={(event) => update({ rentalType: event.target.value })}
            >
              <option value="">Any type</option>
              {RENTAL_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClass}>Availability</span>
            <select
              className="select w-full"
              value={availability}
              onChange={(event) => update({ availability: event.target.value })}
            >
              <option value="">Any</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <span className={labelClass}>Min price</span>
            <label className="input w-full">
              <span className="opacity-60">$</span>
              <input
                type="number"
                min="0"
                className="grow"
                placeholder="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
            </label>
          </div>

          <div>
            <span className={labelClass}>Max price</span>
            <label className="input w-full">
              <span className="opacity-60">$</span>
              <input
                type="number"
                min="0"
                className="grow"
                placeholder="Any"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </label>
          </div>
        </div>

        {hasFilters && (
          <div className="flex justify-end">
            <button
              type="button"
              className="link link-hover text-sm font-semibold text-secondary"
              onClick={clearAll}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
