import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";
import { CATEGORIES, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${SITE_NAME} — ${SITE_TAGLINE}`,
};

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Trust and accountability",
    text: "Role-based access, clear rental terms, and verified listing workflows help protect both customers and equipment owners.",
  },
  {
    icon: Sparkles,
    title: "Flexible rental options",
    text: "Rent by the day, week, or month so you only pay for the exact window your work or event requires.",
  },
  {
    icon: Users,
    title: "Built for local demand",
    text: "Connect equipment owners with nearby renters across construction, photography, vehicles, agriculture, electronics, and events.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8 pb-16">
      <section className="border-b border-base-300 bg-base-200/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            About {SITE_NAME}
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            {SITE_TAGLINE}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-base-content/75 sm:text-base">
            {SITE_NAME} is an equipment rental marketplace designed to make
            high-value tools and gear accessible without the upfront cost of
            buying. Customers can discover available equipment, check pricing
            and availability, book for specific dates, and pay securely online,
            while owners can list items and track rentals effortlessly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/equipment" className="btn btn-primary">
              Explore Equipment
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What drives us"
          title="A simpler way to rent and share equipment"
          description="Focused on clear pricing, reliable availability, and a smooth experience for every role."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title} className="h-full">
              <div className="h-full rounded-box border border-base-300 bg-base-100 p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-content">
                  <Icon size={22} />
                </span>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-base-content/70">
                  {text}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">Categories we cover</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Browse equipment across our core marketplace categories.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/equipment?category=${encodeURIComponent(category)}`}
                className="badge badge-lg badge-outline py-3.5 px-4 hover:badge-primary transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
