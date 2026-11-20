"use client";

import { authClient } from "@/lib/auth-client";
import UserAvatar from "@/components/layout/UserAvatar";

// Temporary page. Step 3 replaces it with the real role dashboards.
export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="skeleton h-52 w-full" />
      </div>
    );
  }

  // Logged-out visitors are redirected by proxy.ts before they get here
  if (!user) return null;

  const pending = user.roleRequestStatus === "pending";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div className="card border border-base-300 bg-base-200">
        <div className="card-body gap-5">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} image={user.image} size={64} />
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold">{user.name}</h1>
              <p className="truncate text-sm text-base-content/70">
                {user.email}
              </p>
            </div>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-base-content/60">
                Current role
              </dt>
              <dd className="font-bold capitalize">{user.role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-base-content/60">
                Requested role
              </dt>
              <dd className="font-bold capitalize">{user.requestedRole}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-base-content/60">
                Request status
              </dt>
              <dd className="font-bold capitalize">{user.roleRequestStatus}</dd>
            </div>
          </dl>

          {pending && (
            <div role="alert" className="alert alert-info alert-soft text-sm">
              Your {user.requestedRole} request is waiting for admin approval.
              Until then you can use RentGear as a customer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
