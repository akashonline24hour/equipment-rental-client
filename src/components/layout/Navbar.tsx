"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import UserAvatar from "@/components/layout/UserAvatar";

type ThemeMode = "rentgear" | "rentgear-dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "rentgear";
  const saved = localStorage.getItem("rentgear-theme");
  if (saved === "rentgear" || saved === "rentgear-dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "rentgear-dark"
    : "rentgear";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  // Sync React theme state to external DOM & localStorage (no setState inside effect)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rentgear-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "rentgear" ? "rentgear-dark" : "rentgear"));
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
      isActive(href)
        ? "bg-primary/15 text-base-content"
        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
    }`;

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await authClient.signOut();
    setLoggingOut(false);

    if (error) {
      toast.error(error.message || "Could not log out. Please try again.");
      return;
    }

    setOpen(false);
    toast.success("Logged out successfully");
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo and website name */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="RentGear logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "rentgear" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "rentgear" ? "dark" : "light"} mode`}
            className="btn btn-ghost btn-square btn-sm"
          >
            {theme === "rentgear" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isPending ? (
            <div className="skeleton h-9 w-44 rounded-lg" />
          ) : user ? (
            <>
              <UserAvatar
                key={user.image ?? "no-photo"}
                name={user.name}
                image={user.image}
              />
              <span className="badge badge-outline badge-sm capitalize">
                {user.role}
              </span>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "rentgear" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "rentgear" ? "dark" : "light"} mode`}
            className="btn btn-ghost btn-square btn-sm"
          >
            {theme === "rentgear" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-square"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-base-300 bg-base-100 lg:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block ${linkClass(link.href)}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6">
            {isPending ? (
              <div className="skeleton h-9 w-full rounded-lg" />
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    key={user.image ?? "no-photo"}
                    name={user.name}
                    image={user.image}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{user.name}</p>
                    <p className="truncate text-xs text-base-content/60 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard"
                    className="btn btn-primary btn-sm"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="btn btn-outline btn-sm"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary btn-sm"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
