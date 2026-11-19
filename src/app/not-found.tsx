import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <SearchX size={32} />
      </span>
      <p className="text-sm font-bold uppercase tracking-widest text-primary">
        Error 404
      </p>
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="text-sm text-base-content/70">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/equipment" className="btn btn-outline">
          Browse equipment
        </Link>
      </div>
    </div>
  );
}