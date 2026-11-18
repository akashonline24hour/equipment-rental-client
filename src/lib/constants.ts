export const SITE_NAME = "Gearly";
export const SITE_TAGLINE = "Rent the right equipment, right when you need it.";

export const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
] as const;

export const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"] as const;

export const ROLES = ["customer", "owner", "admin"] as const;

export type Category = (typeof CATEGORIES)[number];
export type RentalType = (typeof RENTAL_TYPES)[number];
export type Role = (typeof ROLES)[number];