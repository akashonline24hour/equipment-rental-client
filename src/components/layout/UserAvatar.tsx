"use client";

import { useState } from "react";

export default function UserAvatar({
  name,
  image,
  size = 36,
}: {
  name?: string | null;
  image?: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initial = (name?.trim()[0] || "?").toUpperCase();
  const showImage = !!image && image.startsWith("https://") && !failed;

  return (
    <span
      title={name || "My account"}
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm font-bold text-secondary-content ring-2 ring-primary/40"
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name || "Profile photo"}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}