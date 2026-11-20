const STYLES: Record<string, string> = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
  paid: "badge-success",
  unpaid: "badge-warning",
  confirmed: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`badge badge-soft capitalize ${STYLES[status] ?? "badge-neutral"}`}
    >
      {status}
    </span>
  );
}
