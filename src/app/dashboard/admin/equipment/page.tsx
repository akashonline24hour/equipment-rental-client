import type { Metadata } from "next";
import AdminEquipmentList from "@/components/dashboard/AdminEquipmentList";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "All Equipment" };

export default function AdminEquipmentPage() {
  return (
    <>
      <PageHeader
        title="All equipment"
        description="Review new listings, then approve, reject, update or delete equipment."
      />
      <AdminEquipmentList />
    </>
  );
}
