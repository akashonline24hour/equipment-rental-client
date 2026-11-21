import type { Metadata } from "next";
import AdminUsersList from "@/components/dashboard/AdminUsersList";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "All Users" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="All users"
        description="Change roles, review owner and admin requests, and block accounts."
      />
      <AdminUsersList />
    </>
  );
}
