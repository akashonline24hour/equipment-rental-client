import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import {
  CATEGORIES,
  CONTACT,
  NAV_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_LINKS,
} from "@/lib/constants";

const SOCIALS = [
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: FaGithub },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: FaLinkedinIn },
  { label: "X", href: SOCIAL_LINKS.x, Icon: FaXTwitter },
];

const linkClass =
  "text-sm text-neutral-content/70 transition-colors hover:text-primary";
const headingClass =
  "mb-4 text-sm font-bold uppercase tracking-wider text-neutral-content";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="RentGear logo"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <span className="text-xl font-extrabold tracking-tight">
                {SITE_NAME}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-content/70">
              {SITE_TAGLINE} A trusted marketplace connecting equipment owners
              with customers.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-content/20 text-neutral-content/80 transition-colors hover:border-primary hover:bg-primary hover:text-primary-content"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className={headingClass}>Explore</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={headingClass}>Categories</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/equipment?category=${encodeURIComponent(category)}`}
                    className={linkClass}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>Contact</h3>
            <ul className="space-y-3 text-sm text-neutral-content/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{CONTACT.address}</span>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Mail size={16} className="shrink-0 text-primary" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Phone size={16} className="shrink-0 text-primary" />
                  {CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-content/15 pt-6 text-xs text-neutral-content/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>Built with Next.js, Express and MongoDB</p>
        </div>
      </div>
    </footer>
  );
}