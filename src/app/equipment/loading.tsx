export default function EquipmentLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8"
      role="status"
      aria-label="Loading equipment"
    >
      <div className="skeleton h-10 w-64" />
      <div className="skeleton h-44 w-full" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton h-96 w-full" />
        ))}
      </div>
    </div>
  );
}
