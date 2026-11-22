import Link from "next/link";
import {
  ArrowRight,
  Camera,
  HardHat,
  Laptop,
  PartyPopper,
  Sprout,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import type { CategoryCount } from "@/types/home";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  "Construction Equipment": HardHat,
  "Photography Equipment": Camera,
  "Vehicles & Transportation": Truck,
  "Agriculture Equipment": Sprout,
  Electronics: Laptop,
  "Event Equipment": PartyPopper,
};

export default function CategoriesSection({
  counts,
}: {
  counts: CategoryCount[];
}) {
  const countFor = new Map(counts.map((row) => [row.category, row.count]));

  return (
    <section className="bg-base-200/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular categories"
          title="Find equipment by category"
          description="From job sites to weddings, pick a category to see what is available."
        />

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = ICONS[category] ?? Laptop;
            const count = countFor.get(category) ?? 0;

            return (
              <RevealItem key={category} className="h-full">
                <Link
                  href={`/equipment?category=${encodeURIComponent(category)}`}
                  className="group flex h-full items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-base-content transition-colors group-hover:bg-primary group-hover:text-primary-content">
                    <Icon size={26} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-snug">
                      {category}
                    </span>
                    <span className="text-sm text-base-content/60">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-base-content/40 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
