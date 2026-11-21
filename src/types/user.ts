import type { Role } from "@/lib/constants";

export type RequestStatus = "none" | "pending" | "approved" | "rejected";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
  requestedRole: "none" | "owner" | "admin";
  roleRequestStatus: RequestStatus;
  blocked: boolean;
  createdAt: string;
}
