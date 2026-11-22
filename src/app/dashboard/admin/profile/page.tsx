"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save, Upload } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import UserAvatar from "@/components/layout/UserAvatar";
import { ApiError, apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  address?: string;
  role?: string;
};

export default function AdminProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch<{ user: UserProfile }>("/users/me")
      .then((res) => {
        if (!active || !res?.user) return;
        setName(res.user.name || "");
        setEmail(res.user.email || "");
        setImage(res.user.image || "");
        setPhone(res.user.phone || "");
        setAddress(res.user.address || "");
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError ? err.message : "Could not load profile.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage(null);
    setError(null);

    try {
      const uploadedUrl = await uploadImage(file);
      setImage(uploadedUrl);
      setMessage(
        "Photo uploaded. Click Save Changes to save it to your profile.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload photo.",
      );
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await apiFetch<{ message: string; user: UserProfile }>(
        "/users/me",
        {
          method: "PATCH",
          body: { name, image, phone, address },
        },
      );

      if (res.user) {
        setName(res.user.name ?? name);
        setImage(res.user.image ?? image);
        setPhone(res.user.phone ?? phone);
        setAddress(res.user.address ?? address);
      }

      await authClient.getSession();
      router.refresh();
      setMessage(res.message || "Profile updated successfully");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" />
        <div className="skeleton h-80 w-full" />
      </div>
    );
  }

  const isBusy = saving || uploadingPhoto;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Update your administrator account details, photo, phone number, and address."
      />

      <form
        onSubmit={handleSubmit}
        className="card max-w-2xl border border-base-300 bg-base-100"
      >
        <div className="card-body gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <UserAvatar
                key={image || email || "avatar"}
                name={name || email}
                image={image}
                size={64}
              />
              <div>
                <p className="font-bold">{name || "Admin"}</p>
                <p className="text-sm text-base-content/70">{email}</p>
              </div>
            </div>

            <label
              htmlFor="admin-profile-photo-file"
              className={`btn btn-outline btn-sm ${isBusy ? "btn-disabled" : ""}`}
            >
              <Upload size={15} />
              {uploadingPhoto ? "Uploading..." : "Upload from PC"}
              <input
                id="admin-profile-photo-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={isBusy}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {message && (
            <div role="alert" className="alert alert-success alert-soft text-sm">
              <CheckCircle2 size={18} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div role="alert" className="alert alert-error alert-soft text-sm">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label" htmlFor="admin-name">
              <span className="label-text font-medium">Name</span>
            </label>
            <input
              id="admin-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="admin-email">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              id="admin-email"
              type="email"
              disabled
              value={email}
              className="input input-bordered w-full opacity-75"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="admin-image">
              <span className="label-text font-medium">Profile Image URL</span>
            </label>
            <input
              id="admin-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="input input-bordered w-full"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="form-control">
              <label className="label" htmlFor="admin-phone">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <input
                id="admin-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 17..."
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="admin-address">
                <span className="label-text font-medium">Address</span>
              </label>
              <input
                id="admin-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isBusy}
              className="btn btn-primary"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}