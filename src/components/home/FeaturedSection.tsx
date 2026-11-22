import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";
import type { PublicEquipment } from "@/types/equipment";

export default function FeaturedSection({
  items,
}: {
  items: PublicEquipment[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Featured equipment"
        title="Ready to rent today"
        description="Hand-picked listings from verified owners. Log in to see the full details and book."
        action={
          <Link href="/equipment" className="btn btn-outline btn-sm">
            View all equipment <ArrowRight size={16} />
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="rounded-box border border-base-300 bg-base-200 p-8 text-center text-base-content/70">
          Approved equipment will appear here soon.
        </p>
      ) : (
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RevealItem key={item._id} className="h-full">
              <EquipmentCard item={item} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
