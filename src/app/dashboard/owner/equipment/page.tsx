import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import MyEquipmentList from "@/components/dashboard/MyEquipmentList";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "My Equipment" };

export default function MyEquipmentPage() {
  return (
    <>
      <PageHeader
        title="My equipment"
        description="Manage the equipment you have listed for rent."
        action={
          <Link
            href="/dashboard/owner/add-equipment"
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={16} /> Add equipment
          </Link>
        }
      />
      <MyEquipmentList />
    </>
  );
}
