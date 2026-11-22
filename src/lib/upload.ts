export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as {
    url?: string;
    message?: string;
  } | null;

  if (!response.ok || !payload?.url) {
    throw new Error(payload?.message || "Failed to upload image.");
  }

  return payload.url;
}
