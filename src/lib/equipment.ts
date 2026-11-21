// Free units right now. Older items without the field count as fully available.
export function availableUnits(item: {
  availableQuantity?: number;
  quantity: number;
}): number {
  return item.availableQuantity ?? item.quantity;
}
