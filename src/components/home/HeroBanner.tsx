"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80";

const HIGHLIGHTS = [
  { icon: BadgeCheck, text: "Verified equipment owners" },
  { icon: CalendarClock, text: "Daily, weekly and monthly rentals" },
  { icon: ShieldCheck, text: "Secure online payments" },
];

export default function HeroBanner() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="relative isolate overflow-hidden bg-neutral text-neutral-content">
      {!imageFailed && (
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-neutral) 0%, color-mix(in oklab, var(--color-neutral) 85%, transparent) 45%, color-mix(in oklab, var(--color-neutral) 30%, transparent) 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          className="max-w-2xl space-y-6"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="badge badge-primary badge-lg font-semibold">
            Equipment rental marketplace
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Rent the equipment you need,{" "}
            <span className="text-primary">exactly when you need it</span>
          </h1>
          <p className="max-w-xl text-lg text-neutral-content/80">
            RentGear connects customers with trusted equipment owners. Compare
            listings, pick your dates and pay securely online, from cameras and
            tools to vehicles and event gear.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/equipment" className="btn btn-primary btn-lg">
              Browse equipment <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              className="btn btn-lg border-neutral-content/30 bg-transparent text-neutral-content hover:bg-neutral-content/10"
            >
              List your equipment
            </Link>
          </div>
        </motion.div>

        <motion.ul
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon size={18} className="text-primary" />
              {text}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
