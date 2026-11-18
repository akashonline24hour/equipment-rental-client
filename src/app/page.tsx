import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-16">
      <div className="space-y-3">
        <span className="badge badge-secondary">Theme check</span>
        <h1 className="text-4xl font-extrabold tracking-tight">{SITE_NAME}</h1>
        <p className="text-base-content/70">
          If you can see colors, rounded cards and buttons below, Tailwind and
          DaisyUI are working.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-outline">Outline</button>
        <span className="badge badge-success">Success</span>
        <span className="badge badge-error">Error</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((name) => (
          <div key={name} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">{name}</h2>
              <p className="text-sm text-base-content/70">
                Sample category card
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
