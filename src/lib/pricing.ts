const DAY_MS = 86_400_000;

// Both the start day and the end day count. Returns 0 for invalid dates.
export function countDays(start: string, end: string): number {
  const a = Date.parse(`${start}T00:00:00Z`);
  const b = Date.parse(`${end}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  return Math.round((b - a) / DAY_MS) + 1;
}

export function rentalUnits(rentalType: string, days: number): number {
  if (rentalType === "Weekly") return Math.ceil(days / 7);
  if (rentalType === "Monthly") return Math.ceil(days / 30);
  return days;
}

export function priceBooking(input: {
  price: number;
  rentalType: string;
  days: number;
  quantity: number;
}): { units: number; total: number } {
  const units = rentalUnits(input.rentalType, input.days);
  const totalCents = Math.round(input.price * 100) * units * input.quantity;
  return { units, total: totalCents / 100 };
}
