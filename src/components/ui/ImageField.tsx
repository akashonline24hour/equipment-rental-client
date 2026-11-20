"use client";

import { useState, type ChangeEvent } from "react";
import { ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/constants";

export default function ImageField({
  value,
  onChange,
  onUploadingChange,
}: {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      toast.error("Use a JPG, PNG, WEBP or GIF image");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Image must be 2 MB or smaller");
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.message || "Upload failed");
      }
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
          Image
        </span>
        <div className="join">
          <button
            type="button"
            className={`btn btn-xs join-item ${mode === "url" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("url")}
          >
            Link
          </button>
          <button
            type="button"
            className={`btn btn-xs join-item ${mode === "upload" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("upload")}
          >
            Upload
          </button>
        </div>
      </div>

      <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-box border border-base-300 bg-base-200">
        {value.startsWith("https://") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={value}
            src={value}
            alt="Preview"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm text-base-content/50">
            <ImageIcon size={28} /> No image selected
          </span>
        )}
      </div>

      {mode === "url" ? (
        <label className="input w-full">
          <ImageIcon size={16} className="opacity-50" />
          <input
            type="url"
            className="grow"
            placeholder="https://example.com/photo.jpg"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      ) : (
        <input
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="file-input w-full"
          onChange={handleFile}
          disabled={uploading}
        />
      )}

      {uploading && (
        <p className="text-xs text-base-content/60">Uploading image...</p>
      )}
    </div>
  );
}
