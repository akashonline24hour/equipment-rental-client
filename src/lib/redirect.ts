import { AFTER_LOGIN_PATH } from "@/lib/constants";

export function safeRedirect(
  raw: string | null | undefined,
  fallback: string = AFTER_LOGIN_PATH,
): string {
  if (
    !raw ||
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.startsWith("/\\") ||
    raw.startsWith("/login") ||
    raw.startsWith("/register")
  ) {
    return fallback;
  }
  return raw;
}
