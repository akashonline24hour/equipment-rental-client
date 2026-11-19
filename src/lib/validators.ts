export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export function checkPassword(password: string) {
  return {
    minLength: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
  };
}

// Returns the first problem, or null when the password is valid
export function passwordError(password: string): string | null {
  const checks = checkPassword(password);
  if (!checks.minLength) return "Password must be at least 6 characters";
  if (!checks.upper) return "Password must include an uppercase letter";
  if (!checks.lower) return "Password must include a lowercase letter";
  return null;
}

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
