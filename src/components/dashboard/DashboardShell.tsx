"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  CalendarClock,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { Role } from "@/lib/constants";
import UserAvatar from "@/components/layout/UserAvatar";

type NavItem = { label: string; href: string; icon: LucideIcon };

const OVERVIEW: NavItem = {
  label: "Overview",
  href: "/dashboard",
  icon: LayoutDashboard,
};

const NAV: Record<Role, NavItem[]> = {
  customer: [
    OVERVIEW,
    {
      label: "My Rentals",
      href: "/dashboard/customer/rentals",
      icon: CalendarClock,
    },
    { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
    { label: "Profile", href: "/dashboard/customer/profile", icon: UserRound },
  ],
  owner: [
    OVERVIEW,
    {
      label: "Add Equipment",
      href: "/dashboard/owner/add-equipment",
      icon: PlusCircle,
    },
    {
      label: "My Equipment",
      href: "/dashboard/owner/equipment",
      icon: Package,
    },
    {
      label: "My Equipment Rental",
      href: "/dashboard/owner/rentals",
      icon: ClipboardList,
    },
    { label: "My Profile", href: "/dashboard/owner/profile", icon: UserRound },
  ],
  admin: [
    OVERVIEW,
    { label: "All Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "All Equipment",
      href: "/dashboard/admin/equipment",
      icon: Package,
    },
    {
      label: "All Rentals",
      href: "/dashboard/admin/rentals",
      icon: ClipboardList,
    },
    { label: "My Profile", href: "/dashboard/admin/profile", icon: UserRound },
  ],
};

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col lg:flex-row">
        <div className="skeleton h-20 w-full lg:h-auto lg:w-64" />
        <div className="skeleton m-4 h-64 flex-1 lg:m-8" />
      </div>
    );
  }

  const user = session?.user;
  // Logged-out visitors are redirected by proxy.ts before they get here
  if (!user) return null;

  const role: Role =
    user.role === "owner" || user.role === "admin" ? user.role : "customer";
  const items = NAV[role];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col lg:flex-row">
      <aside className="border-b border-base-300 bg-base-100 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        {/* Profile section */}
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:flex-col lg:items-start lg:px-5 lg:py-6">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar
              key={user.image ?? "no-photo"}
              name={user.name}
              image={user.image}
              size={44}
            />
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <span className="badge badge-outline badge-sm capitalize">
                {role}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm lg:hidden"
            aria-expanded={open}
            aria-controls="dashboard-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />} Menu
          </button>
        </div>

        <nav
          id="dashboard-menu"
          aria-label="Dashboard"
          className={`${open ? "block" : "hidden"} px-3 pb-4 lg:block lg:pb-6`}
        >
          <ul className="menu w-full gap-1 p-0">
            {items.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={isActive(href) ? "menu-active" : ""}
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <section className="min-w-0 flex-1 bg-base-200/50 p-4 sm:p-6 lg:p-8">
        {children}
      </section>
    </div>
  );
}
