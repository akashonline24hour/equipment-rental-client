"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { AFTER_LOGIN_PATH } from "@/lib/constants";
import { safeRedirect } from "@/lib/redirect";

type Provider = "google" | "github";

const SOCIAL_ERRORS: Record<string, string> = {
  access_denied: "Sign-in was cancelled. Please try again.",
  account_not_linked:
    "This email is already registered with a different sign-in method.",
  unable_to_link_account:
    "We couldn't link this account. Try your email and password.",
  email_not_found: "Your provider did not share an email address.",
};

function withParams(path: string, params: Record<string, string>) {
  const url = new URL(path, "http://local");
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  return url.pathname + url.search;
}

export default function SocialButtons({
  mode,
}: {
  mode: "login" | "register";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<Provider | null>(null);

  // Show an error toast when the provider sends the user back with ?error=...
  useEffect(() => {
    const code = searchParams.get("error");
    if (!code) return;

    toast.error(
      SOCIAL_ERRORS[code] ?? "Social sign-in failed. Please try again.",
      { toastId: "social-error" },
    );

    const next = new URLSearchParams(searchParams.toString());
    next.delete("error");
    next.delete("error_description");
    const rest = next.toString();
    router.replace(rest ? `${pathname}?${rest}` : pathname);
  }, [searchParams, pathname, router]);

  // Pressing Back from the provider can restore this page with a stuck spinner
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setLoading(null);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  async function handleSocial(provider: Provider) {
    setLoading(provider);

    const target = safeRedirect(searchParams.get("redirect"));
    const redirectParam =
      target === AFTER_LOGIN_PATH
        ? ""
        : `?redirect=${encodeURIComponent(target)}`;

    // The browser leaves for the provider, so the success toast is shown by
    // SocialAuthToast on the page the user lands on
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: withParams(target, { social: provider }),
      newUserCallbackURL: withParams(target, { social: provider, new: "1" }),
      errorCallbackURL: `/${mode}${redirectParam}`,
    });

    if (error) {
      toast.error(
        error.message || "Could not start social sign-in. Please try again.",
      );
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => handleSocial("google")}
          disabled={loading !== null}
        >
          {loading === "google" ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FaGoogle />
          )}
          Google
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => handleSocial("github")}
          disabled={loading !== null}
        >
          {loading === "github" ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FaGithub />
          )}
          GitHub
        </button>
      </div>
      <div className="divider my-2 text-xs uppercase text-base-content/50">
        or continue with email
      </div>
    </div>
  );
}
