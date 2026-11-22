import { BadgeCheck } from "lucide-react";
import UserAvatar from "@/components/layout/UserAvatar";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";
import type { TopOwner } from "@/types/home";

export default function TrustedOwners({ owners }: { owners: TopOwner[] }) {
  if (owners.length === 0) return null;

  return (
    <section className="bg-base-200/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trusted equipment owners"
          title="Meet our top owners"
          description="Owners with the most approved listings on RentGear."
        />

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {owners.map((owner) => (
            <RevealItem key={owner.name} className="h-full">
              <div className="flex h-full flex-col items-center gap-3 rounded-box border border-base-300 bg-base-100 p-6 text-center">
                <UserAvatar name={owner.name} image={owner.image} size={72} />
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{owner.name}</p>
                  <p className="text-sm text-base-content/60">
                    {owner.listings}{" "}
                    {owner.listings === 1 ? "listing" : "listings"}
                  </p>
                </div>
                <span className="badge badge-soft badge-success gap-1">
                  <BadgeCheck size={14} /> Verified owner
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
