import type { Metadata } from "next";
import EditEquipment from "@/components/dashboard/EditEquipment";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "Edit Equipment" };

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageHeader
        title="Edit equipment"
        description="Update the details of your listing."
      />
      <EditEquipment id={id} />
    </>
  );
}
