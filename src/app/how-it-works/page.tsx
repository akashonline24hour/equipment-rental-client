import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  CreditCard,
  PackageCheck,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import HowItWorks from "@/components/home/HowItWorks";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works",
  description: `Learn how renters and equipment owners use ${SITE_NAME} to list, book, pay, and manage rentals.`,
};

const OWNER_STEPS = [
  {
    icon: Wrench,
    title: "List your equipment",
    text: "Add item details, pricing, condition, availability, and photos from your owner dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Get reviewed and approved",
    text: "Listings go through review so customers can browse trusted, accurate equipment.",
  },
  {
    icon: CalendarCheck,
    title: "Manage bookings and earnings",
    text: "Track active rentals, completed orders, and rental payouts in one place.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-4 pb-16">
      <section className="border-b border-base-300 bg-base-200/50">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Guide
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            How {SITE_NAME} works for renters and owners
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-base-content/70 sm:text-base">
            Whether you need specialized gear for a project or want to earn from
            equipment you already own, {SITE_NAME} keeps the rental process
            clear and secure.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/equipment" className="btn btn-primary">
              <Search size={16} />
              Browse Equipment
            </Link>
            <Link href="/register" className="btn btn-outline">
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="For Equipment Owners"
          title="Turn idle equipment into steady rentals"
          description="List your gear, set daily, weekly, or monthly rates, and monitor bookings from your dashboard."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {OWNER_STEPS.map(({ icon: Icon, title, text }, idx) => (
            <RevealItem key={title} className="h-full">
              <div className="h-full rounded-box border border-base-300 bg-base-100 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={22} />
                  </span>
                  <span className="text-sm font-bold text-base-content/40">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-base-content/70">
                  {text}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-box border border-base-300 bg-base-200/50 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 shrink-0 text-primary" size={22} />
            <div>
              <h3 className="font-bold">
                Transparent booking & secure checkout
              </h3>
              <p className="text-sm text-base-content/70">
                Rental totals are calculated upfront from your selected dates
                and quantity before payment.
              </p>
            </div>
          </div>
          <Link href="/dashboard" className="btn btn-primary btn-sm sm:btn-md">
            <PackageCheck size={16} />
            Go to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
