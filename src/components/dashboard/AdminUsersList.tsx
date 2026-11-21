"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Check, Search, SearchX, TriangleAlert, X } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { ApiError, apiFetch } from "@/lib/api";
import { ROLES, type Role } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { AdminUser } from "@/types/user";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import UserAvatar from "@/components/layout/UserAvatar";

type RoleFilter = "all" | Role | "requests";
type SortKey = "newest" | "oldest" | "name";

type PendingAction =
  | { kind: "role"; user: AdminUser; role: Role }
  | { kind: "request"; user: AdminUser; action: "approve" | "reject" }
  | { kind: "block"; user: AdminUser; blocked: boolean };

type ActionResult = { message: string; user: AdminUser };

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name: A to Z" },
];

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const hasPendingRequest = (user: AdminUser) =>
  user.roleRequestStatus === "pending" && user.requestedRole !== "none";

function describe(action: PendingAction) {
  const name = action.user.name || action.user.email;

  if (action.kind === "role") {
    return {
      title: "Change role?",
      message: `${name} will become ${action.role}. Their access changes immediately.`,
      confirmLabel: "Change role",
      tone: "primary" as const,
    };
  }
  if (action.kind === "request") {
    return action.action === "approve"
      ? {
          title: "Approve request?",
          message: `${name} will become ${action.user.requestedRole}.`,
          confirmLabel: "Approve",
          tone: "primary" as const,
        }
      : {
          title: "Reject request?",
          message: `${name}'s ${action.user.requestedRole} request will be rejected. They stay a ${action.user.role}.`,
          confirmLabel: "Reject",
          tone: "danger" as const,
        };
  }
  return action.blocked
    ? {
        title: "Block this user?",
        message: `${name} will not be able to use any private feature until you unblock them.`,
        confirmLabel: "Block",
        tone: "danger" as const,
      }
    : {
        title: "Unblock this user?",
        message: `${name} will be able to use RentGear again.`,
        confirmLabel: "Unblock",
        tone: "primary" as const,
      };
}

function RequestInfo({ user }: { user: AdminUser }) {
  if (hasPendingRequest(user)) {
    return (
      <span className="badge badge-soft badge-warning capitalize">
        Wants {user.requestedRole}
      </span>
    );
  }
  if (user.roleRequestStatus === "rejected") {
    return (
      <span className="text-xs text-base-content/60">Request rejected</span>
    );
  }
  return <span className="text-xs text-base-content/50">-</span>;
}

function UserActions({
  user,
  isSelf,
  onAction,
}: {
  user: AdminUser;
  isSelf: boolean;
  onAction: (action: PendingAction) => void;
}) {
  if (isSelf) {
    return <span className="text-xs text-base-content/60">This is you</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasPendingRequest(user) && (
        <>
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() =>
              onAction({ kind: "request", user, action: "approve" })
            }
          >
            <Check size={14} /> Approve
          </button>
          <button
            type="button"
            className="btn btn-outline btn-error btn-sm"
            onClick={() =>
              onAction({ kind: "request", user, action: "reject" })
            }
          >
            <X size={14} /> Reject
          </button>
        </>
      )}

      <select
        className="select select-sm w-32"
        value={user.role}
        aria-label={`Change role of ${user.name || user.email}`}
        onChange={(event) =>
          onAction({ kind: "role", user, role: event.target.value as Role })
        }
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {capitalize(role)}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={`btn btn-sm ${user.blocked ? "btn-outline" : "btn-ghost text-error"}`}
        onClick={() =>
          onAction({ kind: "block", user, blocked: !user.blocked })
        }
      >
        {user.blocked ? (
          <>
            <Check size={14} /> Unblock
          </>
        ) : (
          <>
            <Ban size={14} /> Block
          </>
        )}
      </button>
    </div>
  );
}

function UserRow({
  user,
  isSelf,
  onAction,
}: {
  user: AdminUser;
  isSelf: boolean;
  onAction: (action: PendingAction) => void;
}) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} image={user.image} />
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-semibold">
              <span className="max-w-48 truncate">
                {user.name || "No name"}
              </span>
              {user.blocked && (
                <span className="badge badge-soft badge-error badge-sm">
                  Blocked
                </span>
              )}
            </p>
            <p className="max-w-56 truncate text-xs text-base-content/60">
              {user.email}
            </p>
          </div>
        </div>
      </td>
      <td>
        <span className="badge badge-outline capitalize">{user.role}</span>
      </td>
      <td>
        <RequestInfo user={user} />
      </td>
      <td className="whitespace-nowrap text-sm">
        {formatDate(user.createdAt)}
      </td>
      <td>
        <UserActions user={user} isSelf={isSelf} onAction={onAction} />
      </td>
    </tr>
  );
}

function UserCard({
  user,
  isSelf,
  onAction,
}: {
  user: AdminUser;
  isSelf: boolean;
  onAction: (action: PendingAction) => void;
}) {
  return (
    <article className="card h-full border border-base-300 bg-base-100">
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} image={user.image} size={44} />
          <div className="min-w-0">
            <p className="truncate font-bold">{user.name || "No name"}</p>
            <p className="truncate text-xs text-base-content/60">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-outline capitalize">{user.role}</span>
          {user.blocked && (
            <span className="badge badge-soft badge-error">Blocked</span>
          )}
          <RequestInfo user={user} />
        </div>

        <p className="text-xs text-base-content/60">
          Joined {formatDate(user.createdAt)}
        </p>

        <div className="mt-auto border-t border-base-300 pt-3">
          <UserActions user={user} isSelf={isSelf} onAction={onAction} />
        </div>
      </div>
    </article>
  );
}

export default function AdminUsersList() {
  const { data: session } = authClient.useSession();
  const myId = session?.user.id;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const [action, setAction] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<AdminUser[]>("/admin/users")
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "Could not load users",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const counts = useMemo<Record<RoleFilter, number>>(
    () => ({
      all: users.length,
      customer: users.filter((user) => user.role === "customer").length,
      owner: users.filter((user) => user.role === "owner").length,
      admin: users.filter((user) => user.role === "admin").length,
      requests: users.filter(hasPendingRequest).length,
    }),
    [users],
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = users.filter((user) => {
      if (filter === "requests" && !hasPendingRequest(user)) return false;
      if (filter !== "all" && filter !== "requests" && user.role !== filter)
        return false;
      if (!query) return true;
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });

    const time = (value: string) => new Date(value).getTime();
    return filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "oldest") return time(a.createdAt) - time(b.createdAt);
      return time(b.createdAt) - time(a.createdAt);
    });
  }, [users, search, filter, sort]);

  function retry() {
    setError("");
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  async function runAction() {
    if (!action) return;

    setBusy(true);
    try {
      let result: ActionResult;

      if (action.kind === "role") {
        result = await apiFetch<ActionResult>(
          `/admin/users/${action.user.id}/role`,
          { method: "PATCH", body: { role: action.role } },
        );
      } else if (action.kind === "request") {
        result = await apiFetch<ActionResult>(
          `/admin/users/${action.user.id}/role-request`,
          { method: "PATCH", body: { action: action.action } },
        );
      } else {
        result = await apiFetch<ActionResult>(
          `/admin/users/${action.user.id}/block`,
          { method: "PATCH", body: { blocked: action.blocked } },
        );
      }

      setUsers((previous) =>
        previous.map((user) =>
          user.id === result.user.id ? result.user : user,
        ),
      );
      toast.success(result.message);
      setAction(null);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-full" />
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="skeleton h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mx-auto max-w-md border border-error/30 bg-base-100">
        <div className="card-body items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
            <TriangleAlert size={28} />
          </span>
          <h2 className="text-lg font-bold">Could not load users</h2>
          <p className="text-sm text-base-content/70">{error}</p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const tabs: { value: RoleFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "requests", label: "Requests" },
    { value: "customer", label: "Customers" },
    { value: "owner", label: "Owners" },
    { value: "admin", label: "Admins" },
  ];
  const described = action ? describe(action) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="input w-full sm:max-w-sm">
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            className="grow"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={14} />
            </button>
          )}
        </label>

        <select
          className="select w-full sm:ml-auto sm:w-48"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          aria-label="Sort users"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(tab.value)}
              className={`btn btn-sm shrink-0 rounded-full ${
                active ? "btn-primary" : "btn-ghost border border-base-300"
              }`}
            >
              {tab.label}
              <span className="badge badge-sm">{counts[tab.value]}</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-base-content/60">
        Showing {visible.length} of {users.length}
      </p>

      {visible.length === 0 ? (
        <div className="card mx-auto max-w-md border border-base-300 bg-base-100">
          <div className="card-body items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-base-200 text-base-content/60">
              <SearchX size={28} />
            </span>
            <h2 className="text-lg font-bold">No users found</h2>
            <p className="text-sm text-base-content/70">
              Try a different search or filter.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 md:block">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Request</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isSelf={user.id === myId}
                    onAction={setAction}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {visible.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelf={user.id === myId}
                onAction={setAction}
              />
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={described !== null}
        title={described?.title ?? ""}
        message={described?.message ?? ""}
        confirmLabel={described?.confirmLabel}
        tone={described?.tone}
        loading={busy}
        onConfirm={runAction}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
