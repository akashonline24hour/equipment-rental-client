export default function EquipmentDetailsSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      role="status"
      aria-label="Loading equipment"
    >
      <div className="skeleton mb-6 h-5 w-64" />
      <div className="skeleton mb-6 h-12 w-3/4" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="skeleton aspect-[16/10] w-full" />
          <div className="skeleton h-40 w-full" />
          <div className="skeleton h-32 w-full" />
        </div>
        <div className="skeleton h-96 w-full" />
      </div>
    </div>
  );
}
