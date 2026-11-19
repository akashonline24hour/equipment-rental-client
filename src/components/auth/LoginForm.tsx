"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { AFTER_LOGIN_PATH } from "@/lib/constants";
import { safeRedirect } from "@/lib/redirect";
import { EMAIL_PATTERN } from "@/lib/validators";
import SocialButtons from "@/components/auth/SocialButtons";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const target = safeRedirect(searchParams.get("redirect"));
  const registerHref =
    target === AFTER_LOGIN_PATH
      ? "/register"
      : `/register?redirect=${encodeURIComponent(target)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(error.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    toast.success("Welcome back! Login successful.");
    router.replace(target);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <SocialButtons mode="login" />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Email address
          </span>
          <label className="input w-full">
            <Mail size={16} className="opacity-50" />
            <input
              type="email"
              className="grow"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>

        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Password
          </span>
          <label className="input w-full">
            <Lock size={16} className="opacity-50" />
            <input
              type={showPassword ? "text" : "password"}
              className="grow"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-base-content/70">
        New to RentGear?{" "}
        <Link href={registerHref} className="link font-semibold text-secondary">
          Create an account
        </Link>
      </p>
    </div>
  );
}
