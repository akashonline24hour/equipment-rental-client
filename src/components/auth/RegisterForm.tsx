"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import {
  AFTER_LOGIN_PATH,
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  ROLE_OPTIONS,
  type Role,
} from "@/lib/constants";
import { safeRedirect } from "@/lib/redirect";
import {
  EMAIL_PATTERN,
  checkPassword,
  isHttpsUrl,
  passwordError,
} from "@/lib/validators";
import SocialButtons from "@/components/auth/SocialButtons";

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70";

// Defined outside the form so React doesn't recreate it on every render
function Rule({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <li
      className={`flex items-center gap-1.5 text-xs ${
        ok ? "text-success" : "text-base-content/50"
      }`}
    >
      {ok ? <Check size={13} /> : <X size={13} />} {children}
    </li>
  );
}

function PhotoPreview({ src, name }: { src: string; name: string }) {
  const valid = src.startsWith("https://");
  const initial = (name.trim()[0] || "?").toUpperCase();

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-300 text-sm font-bold text-base-content/70">
      {valid ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Profile preview"
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("customer");
  const [photoMode, setPhotoMode] = useState<"url" | "upload">("url");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = checkPassword(password);
  const target = safeRedirect(searchParams.get("redirect"));
  const loginHref =
    target === AFTER_LOGIN_PATH
      ? "/login"
      : `/login?redirect=${encodeURIComponent(target)}`;

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
    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.message || "Upload failed");
      }
      setImage(data.url);
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function validate(): string | null {
    if (name.trim().length < 2) return "Please enter your full name";
    if (!EMAIL_PATTERN.test(email.trim()))
      return "Please enter a valid email address";
    const passwordProblem = passwordError(password);
    if (passwordProblem) return passwordProblem;
    if (uploading) return "Please wait for the photo to finish uploading";
    if (image.trim() && !isHttpsUrl(image.trim()))
      return "The photo link must start with https://";
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: image.trim() || undefined,
      requestedRole: role === "customer" ? "none" : role,
    });

    if (error) {
      toast.error(error.message || "Registration failed");
      setLoading(false);
      return;
    }

    toast.success("Account created successfully!");
    if (role !== "customer") {
      toast.info(
        `Your ${role} request was sent to an admin. Until it is approved, you can use RentGear as a customer.`,
        { autoClose: 6000 },
      );
    }
    router.replace(target);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <SocialButtons mode="register" />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <span className={labelClass}>Full name</span>
          <label className="input w-full">
            <User size={16} className="opacity-50" />
            <input
              type="text"
              className="grow"
              placeholder="Your full name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        </div>

        <div>
          <span className={labelClass}>Email address</span>
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
          <span className={labelClass}>Password</span>
          <label className="input w-full">
            <Lock size={16} className="opacity-50" />
            <input
              type={showPassword ? "text" : "password"}
              className="grow"
              placeholder="Create a password"
              autoComplete="new-password"
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
          <ul className="mt-2 space-y-1">
            <Rule ok={checks.minLength}>At least 6 characters</Rule>
            <Rule ok={checks.upper}>One uppercase letter (A-Z)</Rule>
            <Rule ok={checks.lower}>One lowercase letter (a-z)</Rule>
          </ul>
        </div>

        <fieldset>
          <legend className={labelClass}>Account type</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer flex-col gap-1 rounded-box border border-base-300 p-3 transition-colors hover:bg-base-200 has-[:checked]:border-primary has-[:checked]:bg-primary/10"
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <input
                    type="radio"
                    name="role"
                    className="radio radio-primary radio-xs"
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                  />
                  {option.label}
                </span>
                <span className="text-xs leading-snug text-base-content/60">
                  {option.description}
                </span>
              </label>
            ))}
          </div>
          {role !== "customer" && (
            <p className="mt-2 text-xs text-base-content/70">
              You will start as a customer. An admin reviews your {role} request
              before it takes effect.
            </p>
          )}
        </fieldset>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Photo (optional)
            </span>
            <div className="join">
              <button
                type="button"
                className={`btn btn-xs join-item ${photoMode === "url" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setPhotoMode("url")}
              >
                Link
              </button>
              <button
                type="button"
                className={`btn btn-xs join-item ${photoMode === "upload" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setPhotoMode("upload")}
              >
                Upload
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PhotoPreview src={image} name={name} />
            {photoMode === "url" ? (
              <label className="input w-full">
                <ImageIcon size={16} className="opacity-50" />
                <input
                  type="url"
                  className="grow"
                  placeholder="https://example.com/photo.jpg"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
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
          </div>
          {uploading && (
            <p className="mt-1 text-xs text-base-content/60">
              Uploading photo...
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading || uploading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link href={loginHref} className="link font-semibold text-secondary">
          Log in
        </Link>
      </p>
    </div>
  );
}
