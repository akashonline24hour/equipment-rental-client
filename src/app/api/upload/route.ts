import { NextResponse } from "next/server";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/constants";

export async function POST(request: Request) {
  const key = process.env.IMGBB_API_KEY;
  if (!key) {
    return NextResponse.json(
      { message: "Image upload is not configured" },
      { status: 500 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image was sent" }, { status: 400 });
  }
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { message: "Use a JPG, PNG, WEBP or GIF image" },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { message: "Image must be 2 MB or smaller" },
      { status: 400 },
    );
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    return NextResponse.json(
      { message: "Could not upload the image. Try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: result.data.display_url as string });
}