import type { Metadata } from "next";
import EquipmentForm from "@/components/dashboard/EquipmentForm";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "Add Equipment" };

export default function AddEquipmentPage() {
  return (
    <>
      <PageHeader
        title="Add equipment"
        description="List equipment for rent. An admin reviews it before customers can see it."
      />
      <EquipmentForm mode="add" />
    </>
  );
}
