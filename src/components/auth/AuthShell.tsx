import Image from "next/image";
import type { ReactNode } from "react";
import { BadgeCheck, CalendarClock, ShieldCheck } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const PERKS = [
  { icon: BadgeCheck, text: "Verified equipment owners" },
  { icon: CalendarClock, text: "Flexible daily, weekly and monthly rentals" },
  { icon: ShieldCheck, text: "Secure online payments with Stripe" },
];

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <aside className="hidden flex-col justify-center gap-8 bg-neutral p-12 text-neutral-content lg:flex">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <span className="text-3xl font-extrabold tracking-tight">
            {SITE_NAME}
          </span>
        </div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-extrabold leading-tight">
            Rent gear. List gear. Get the job done.
          </h2>
          <p className="text-neutral-content/70">
            One marketplace for customers who need equipment and owners who want
            it working for them.
          </p>
        </div>
        <ul className="space-y-4">
          {PERKS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon size={18} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-sm text-base-content/70">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
