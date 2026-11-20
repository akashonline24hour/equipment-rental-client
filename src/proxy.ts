import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { AFTER_LOGIN_PATH, type Role } from "@/lib/constants";

const AUTH_PAGES = ["/login", "/register"];

// Dashboard sections that only one role may open
const ROLE_RULES: { prefix: string; role: Role }[] = [
  { prefix: "/dashboard/customer", role: "customer" },
  { prefix: "/dashboard/owner", role: "owner" },
  { prefix: "/dashboard/admin", role: "admin" },
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check the real session (not just that a cookie exists)
  let session: Awaited<ReturnType<typeof auth.api.getSession>> = null;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    session = null;
  }

  // Login and register: logged-in users are sent away
  if (AUTH_PAGES.includes(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL(AFTER_LOGIN_PATH, request.url));
    }
    return NextResponse.next();
  }

  // Everything else in the matcher is private
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Role-specific dashboard sections
  const role = (session.user as { role?: string }).role;
  const rule = ROLE_RULES.find(
    (item) =>
      pathname === item.prefix || pathname.startsWith(`${item.prefix}/`),
  );
  if (rule && role !== rule.role) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/equipment/:path+", // equipment details are private, the list at /equipment stays public
    "/payment/:path*",
  ],
};