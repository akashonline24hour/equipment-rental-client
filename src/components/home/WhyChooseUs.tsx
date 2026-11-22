import { BadgeCheck, CalendarClock, ShieldCheck, Wallet } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const BENEFITS = [
  {
    icon: Wallet,
    title: "Affordable rental prices",
    text: "Rent only for as long as you need it and skip the cost of buying equipment you will use once.",
  },
  {
    icon: BadgeCheck,
    title: "Verified equipment owners",
    text: "Every listing is reviewed by an admin before it appears, so you know what you are renting.",
  },
  {
    icon: CalendarClock,
    title: "Flexible rental periods",
    text: "Choose daily, weekly or monthly rental and pick the exact start and end dates that suit your project.",
  },
  {
    icon: ShieldCheck,
    title: "Secure online payments",
    text: "Pay by card through Stripe. Your payment details never touch our servers.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Why choose us"
        title="Renting made simple and safe"
        description="Everything you need to find, book and pay for equipment with confidence."
      />

      <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <RevealItem key={title} className="h-full">
            <div className="h-full rounded-box border border-base-300 bg-base-100 p-6">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-base-content">
                <Icon size={24} />
              </span>
              <h3 className="mb-2 text-lg font-bold leading-snug">{title}</h3>
              <p className="text-sm leading-relaxed text-base-content/70">
                {text}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
