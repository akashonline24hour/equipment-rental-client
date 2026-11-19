export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-sm font-medium text-base-content/60">Loading...</p>
    </div>
  );
}
