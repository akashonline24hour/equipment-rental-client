const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Used to show prices like "$45.00 / day"
export const RENTAL_UNIT: Record<string, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};

// For dates stored as midnight UTC, such as the first and last day of a rental
export function formatDay(value: string | Date | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
