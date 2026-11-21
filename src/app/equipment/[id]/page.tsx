import type { Metadata } from "next";
import EquipmentDetails from "@/components/equipment/EquipmentDetails";

export const metadata: Metadata = { title: "Equipment Details" };

export default async function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // key makes React start fresh for each item, so an old item is never shown
  return <EquipmentDetails key={id} id={id} />;
}
