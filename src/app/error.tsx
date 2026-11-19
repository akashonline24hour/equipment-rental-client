"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
        <TriangleAlert size={32} />
      </span>
      <h1 className="text-2xl font-extrabold">Something went wrong</h1>
      <p className="text-sm text-base-content/70">
        An unexpected error occurred. You can try again, or go back to the home
        page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Go home
        </Link>
      </div>
    </div>
  );
}
