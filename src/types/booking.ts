import type { PublicEquipment } from "@/types/equipment";

export interface Booking {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  equipmentCategory: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  days: number;
  units: number;
  quantity: number;
  rentalType: string;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
  paymentStatus: "paid" | "unpaid" | "refunded";
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface FavoriteItem {
  _id: string;
  equipmentId: string;
  createdAt: string;
  equipment: PublicEquipment;
}
