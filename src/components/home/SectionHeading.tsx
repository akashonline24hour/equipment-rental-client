import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-bold uppercase tracking-widest text-secondary">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && <p className="text-base-content/70">{description}</p>}
      </div>
      {action}
    </div>
  );
}
