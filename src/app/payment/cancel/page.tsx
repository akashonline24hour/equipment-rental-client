import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  const { equipment } = await searchParams;
  const backHref =
    equipment && /^[a-f\d]{24}$/i.test(equipment)
      ? `/equipment/${equipment}`
      : "/equipment";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-10">
      <div className="card w-full border border-base-300 bg-base-100">
        <div className="card-body items-center gap-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning">
            <XCircle size={34} />
          </span>
          <h1 className="text-2xl font-extrabold">Payment cancelled</h1>
          <p className="text-sm text-base-content/70">
            You were not charged and nothing was booked. You can try again
            whenever you are ready.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <Link href={backHref} className="btn btn-primary">
              Back to the equipment
            </Link>
            <Link href="/equipment" className="btn btn-outline">
              Browse all equipment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
