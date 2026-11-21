import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchX, TriangleAlert } from "lucide-react";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import EquipmentFilters from "@/components/equipment/EquipmentFilters";
import Pagination from "@/components/equipment/Pagination";
import { publicFetch } from "@/lib/public-api";
import type { EquipmentPage } from "@/types/equipment";

export const metadata: Metadata = { title: "All Equipment" };

const PAGE_SIZE = 9;
const ALLOWED_PARAMS = [
  "q",
  "category",
  "rentalType",
  "availability",
  "minPrice",
  "maxPrice",
  "sort",
  "page",
] as const;

type RawParams = Record<string, string | string[] | undefined>;

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const raw = await searchParams;

  // Keep only the parameters we understand, one value each
  const params = new URLSearchParams();
  for (const key of ALLOWED_PARAMS) {
    const value = raw[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (first) params.set(key, first);
  }
  const requestedPage = Math.max(
    1,
    parseInt(params.get("page") ?? "1", 10) || 1,
  );

  const apiParams = new URLSearchParams(params);
  apiParams.set("limit", String(PAGE_SIZE));

  let data: EquipmentPage | null = null;
  try {
    data = await publicFetch<EquipmentPage>(
      `/equipment?${apiParams.toString()}`,
    );
  } catch {
    data = null;
  }

  // A page number beyond the last page goes to the last page
  if (data && data.total > 0 && requestedPage > data.totalPages) {
    const next = new URLSearchParams(params);
    if (data.totalPages > 1) next.set("page", String(data.totalPages));
    else next.delete("page");
    const query = next.toString();
    redirect(query ? `/equipment?${query}` : "/equipment");
  }

  const hasFilters = [
    "q",
    "category",
    "rentalType",
    "availability",
    "minPrice",
    "maxPrice",
  ].some((key) => params.has(key));

  return (
    <>
      <section className="border-b border-base-300 bg-base-200/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            All equipment
          </h1>
          <p className="mt-2 max-w-2xl text-base-content/70">
            Browse approved equipment from verified owners. Search, filter and
            sort to find exactly what you need.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="skeleton h-44 w-full" />}>
          <EquipmentFilters />
        </Suspense>

        {data === null ? (
          <div className="card mx-auto max-w-md border border-error/30 bg-base-100">
            <div className="card-body items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
                <TriangleAlert size={28} />
              </span>
              <h2 className="text-lg font-bold">Could not load equipment</h2>
              <p className="text-sm text-base-content/70">
                The server did not answer. Please try again in a moment.
              </p>
              <Link href="/equipment" className="btn btn-primary btn-sm">
                Try again
              </Link>
            </div>
          </div>
        ) : data.items.length === 0 ? (
          <div className="card mx-auto max-w-md border border-base-300 bg-base-100">
            <div className="card-body items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-base-200 text-base-content/60">
                <SearchX size={28} />
              </span>
              <h2 className="text-lg font-bold">
                {hasFilters ? "No equipment matches" : "No equipment yet"}
              </h2>
              <p className="text-sm text-base-content/70">
                {hasFilters
                  ? "Try a different search or remove some filters."
                  : "Approved equipment will appear here."}
              </p>
              {hasFilters && (
                <Link href="/equipment" className="btn btn-outline btn-sm">
                  Clear all filters
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-base-content/60">
              Showing {(data.page - 1) * data.limit + 1} to{" "}
              {(data.page - 1) * data.limit + data.items.length} of {data.total}{" "}
              items
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((item) => (
                <EquipmentCard key={item._id} item={item} />
              ))}
            </div>

            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              params={params}
            />
          </>
        )}
      </div>
    </>
  );
}
