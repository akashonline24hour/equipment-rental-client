import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageNumbers(current: number, total: number): (number | "gap")[] {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...wanted]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("gap");
    result.push(page);
  });
  return result;
}

export default function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: URLSearchParams;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const next = new URLSearchParams(params);
    if (target <= 1) next.delete("page");
    else next.set("page", String(target));
    const query = next.toString();
    return query ? `/equipment?${query}` : "/equipment";
  };

  return (
    <nav aria-label="Pagination" className="flex justify-center pt-4">
      <div className="join">
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className="btn join-item btn-sm"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <button
            className="btn join-item btn-sm"
            disabled
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {pageNumbers(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <button
              key={`gap-${index}`}
              className="btn join-item btn-sm"
              disabled
            >
              ...
            </button>
          ) : (
            <Link
              key={item}
              href={href(item)}
              aria-current={item === page ? "page" : undefined}
              className={`btn join-item btn-sm ${item === page ? "btn-primary" : ""}`}
            >
              {item}
            </Link>
          ),
        )}

        {page < totalPages ? (
          <Link
            href={href(page + 1)}
            className="btn join-item btn-sm"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <button
            className="btn join-item btn-sm"
            disabled
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </nav>
  );
}
