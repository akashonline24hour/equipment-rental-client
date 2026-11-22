import { CalendarCheck, CreditCard, PackageCheck, Search } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const STEPS = [
  {
    icon: Search,
    title: "Find equipment",
    text: "Search by name or location, then filter by category, price and availability.",
  },
  {
    icon: CalendarCheck,
    title: "Pick your dates",
    text: "Choose the start and end date and the quantity you need. The total is calculated for you.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Confirm and pay online with Stripe. Your booking is recorded straight away.",
  },
  {
    icon: PackageCheck,
    title: "Collect and return",
    text: "Meet the owner, use the equipment, and return it when your rental period ends.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="How it works"
        title="Rent equipment in four steps"
        description="From search to return, the whole process takes only a few minutes."
      />

      <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <RevealItem key={title} className="h-full">
            <div className="relative h-full rounded-box border border-base-300 bg-base-100 p-6">
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-base-300 select-none">
                {index + 1}
              </span>
              <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-content">
                <Icon size={24} />
              </span>
              <h3 className="relative mb-2 text-lg font-bold">{title}</h3>
              <p className="relative text-sm leading-relaxed text-base-content/70">
                {text}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
