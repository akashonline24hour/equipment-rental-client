import type { Metadata } from "next";
import EditEquipment from "@/components/dashboard/EditEquipment";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "Edit Equipment" };

export default async function AdminEditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageHeader
        title="Edit equipment"
        description="Update this listing as an administrator."
      />
      <EditEquipment id={id} admin />
    </>
  );
}
