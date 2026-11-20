import type { Category, Condition, RentalType } from "@/lib/constants";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: Category;
  location: string;
  price: number;
  rentalType: RentalType;
  quantity: number;
  condition: Condition;
  brand: string;
  model: string;
  image: string;
  terms: string;
  status: EquipmentStatus;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerImage: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
}
