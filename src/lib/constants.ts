export const SITE_NAME = "RentGear";
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

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

// Placeholder contact details. Replace them with real ones.
export const CONTACT = {
  email: "support@rentgear.example",
  phone: "+880 1700-000000",
  address: "Gulshan Avenue, Dhaka, Bangladesh",
} as const;

// Replace the X address with your own profile, or remove that entry.
export const SOCIAL_LINKS = {
  github: "https://github.com/akashonline24hour",
  linkedin: "https://www.linkedin.com/in/akash-chandra-paul-24-online",
  x: "https://x.com/",
} as const;

// Where users land after logging in (will become "/dashboard" in a later step)
export const AFTER_LOGIN_PATH = "/";

export const ROLE_OPTIONS = [
  {
    value: "customer",
    label: "Customer",
    description: "Browse and rent equipment.",
  },
  {
    value: "owner",
    label: "Owner",
    description: "List equipment for rent. Needs approval.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage the platform. Needs approval.",
  },
] as const;

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const CONDITIONS = ["New", "Like New", "Good", "Fair"] as const;
export type Condition = (typeof CONDITIONS)[number];