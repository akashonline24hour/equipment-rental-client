import { authClient } from "@/lib/auth-client";

// NEXT_PUBLIC_API_URL ends with /api, for example http://localhost:5000/api
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean; // true by default. Pass false for public endpoints.
};

export async function apiFetch<T = unknown>(
  path: string,
  { method = "GET", body, auth = true }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      throw new ApiError("Please log in to continue", 401);
    }
    headers.Authorization = `Bearer ${data.token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(json?.message || "Something went wrong", response.status);
  }
  return json as T;
}