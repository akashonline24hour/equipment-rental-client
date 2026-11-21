"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { ApiError, apiFetch } from "@/lib/api";
import { CATEGORIES, CONDITIONS, RENTAL_TYPES } from "@/lib/constants";
import { isHttpsUrl } from "@/lib/validators";
import type { Equipment } from "@/types/equipment";
import ImageField from "@/components/ui/ImageField";
import StatusBadge from "@/components/ui/StatusBadge";

type Props =
  | { mode: "add"; backHref?: string }
  | { mode: "edit"; equipment: Equipment; backHref?: string };

const DEFAULT_BACK_HREF = "/dashboard/owner/equipment";

// Defined outside the form so React doesn't recreate it on every render
function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function EquipmentForm(props: Props) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const equipment = props.mode === "edit" ? props.equipment : undefined;
  const backHref = props.backHref ?? DEFAULT_BACK_HREF;

  const [name, setName] = useState(equipment?.name ?? "");
  const [description, setDescription] = useState(equipment?.description ?? "");
  const [category, setCategory] = useState<string>(equipment?.category ?? "");
  const [location, setLocation] = useState(equipment?.location ?? "");
  const [price, setPrice] = useState(equipment ? String(equipment.price) : "");
  const [rentalType, setRentalType] = useState<string>(
    equipment?.rentalType ?? "",
  );
  const [quantity, setQuantity] = useState(
    equipment ? String(equipment.quantity) : "",
  );
  const [condition, setCondition] = useState<string>(
    equipment?.condition ?? "",
  );
  const [brand, setBrand] = useState(equipment?.brand ?? "");
  const [model, setModel] = useState(equipment?.model ?? "");
  const [image, setImage] = useState(equipment?.image ?? "");
  const [terms, setTerms] = useState(equipment?.terms ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const status = equipment?.status ?? "pending";
  const ownerName = equipment?.ownerName ?? session?.user.name ?? "";
  const ownerEmail = equipment?.ownerEmail ?? session?.user.email ?? "";

  function validate(): string | null {
    const priceNumber = Number(price);
    const quantityNumber = Number(quantity);

    if (name.trim().length < 3 || name.trim().length > 100)
      return "Name must be 3 to 100 characters";
    if (!(CATEGORIES as readonly string[]).includes(category))
      return "Choose a category";
    if (brand.trim().length < 1 || brand.trim().length > 50)
      return "Brand must be 1 to 50 characters";
    if (model.trim().length < 1 || model.trim().length > 50)
      return "Model must be 1 to 50 characters";
    if (location.trim().length < 2 || location.trim().length > 100)
      return "Location must be 2 to 100 characters";
    if (!(CONDITIONS as readonly string[]).includes(condition))
      return "Choose the equipment condition";
    if (
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0 ||
      priceNumber > 100000
    )
      return "Price must be more than 0 and at most 100000";
    if (!(RENTAL_TYPES as readonly string[]).includes(rentalType))
      return "Choose a rental type";
    if (
      !Number.isInteger(quantityNumber) ||
      quantityNumber < 1 ||
      quantityNumber > 1000
    )
      return "Quantity must be a whole number from 1 to 1000";
    if (description.trim().length < 20 || description.trim().length > 2000)
      return "Description must be 20 to 2000 characters";
    if (!isHttpsUrl(image.trim()))
      return "Add an image: use a link that starts with https:// or upload a file";
    if (terms.trim().length < 10 || terms.trim().length > 1500)
      return "Rental terms must be 10 to 1500 characters";
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploading) {
      toast.info("Please wait for the image to finish uploading");
      return;
    }
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      price: Number(price),
      rentalType,
      quantity: Number(quantity),
      condition,
      brand: brand.trim(),
      model: model.trim(),
      image: image.trim(),
      terms: terms.trim(),
    };

    setSaving(true);
    try {
      const result =
        props.mode === "add"
          ? await apiFetch<{ message: string }>("/equipment", {
              method: "POST",
              body: payload,
            })
          : await apiFetch<{ message: string }>(
              `/equipment/${props.equipment._id}`,
              { method: "PUT", body: payload },
            );

      toast.success(result.message);
      router.push(backHref);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Your session expired. Please log in again.");
        router.replace(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-5">
          <h2 className="card-title text-base">Equipment details</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Equipment name">
              <input
                type="text"
                className="input w-full"
                placeholder="e.g. Canon EOS R6 Camera Kit"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>

            <Field label="Category">
              <select
                className="select w-full"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Brand">
              <input
                type="text"
                className="input w-full"
                placeholder="e.g. Canon"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              />
            </Field>

            <Field label="Model">
              <input
                type="text"
                className="input w-full"
                placeholder="e.g. EOS R6"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              />
            </Field>

            <Field label="Location">
              <input
                type="text"
                className="input w-full"
                placeholder="e.g. Gulshan, Dhaka"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </Field>

            <Field label="Condition">
              <select
                className="select w-full"
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
              >
                <option value="" disabled>
                  Select the condition
                </option>
                {CONDITIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Rental price (USD)">
              <label className="input w-full">
                <span className="opacity-60">$</span>
                <input
                  type="number"
                  className="grow"
                  placeholder="45"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
            </Field>

            <Field label="Rental type">
              <select
                className="select w-full"
                value={rentalType}
                onChange={(event) => setRentalType(event.target.value)}
              >
                <option value="" disabled>
                  Select a rental type
                </option>
                {RENTAL_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Available quantity">
              <input
                type="number"
                className="input w-full"
                placeholder="3"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </Field>

            <Field label="Description" className="md:col-span-2">
              <textarea
                className="textarea w-full"
                rows={4}
                placeholder="Describe the equipment, what is included and what it is best used for."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>

            <Field
              label="Rental terms and conditions"
              className="md:col-span-2"
            >
              <textarea
                className="textarea w-full"
                rows={4}
                placeholder="e.g. A security deposit is required. Return the equipment clean and on time."
                value={terms}
                onChange={(event) => setTerms(event.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-4">
          <h2 className="card-title text-base">Equipment image</h2>
          <ImageField
            value={image}
            onChange={setImage}
            onUploadingChange={setUploading}
          />
        </div>
      </div>

      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-4">
          <h2 className="card-title text-base">Listing information</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Status
              </span>
              <StatusBadge status={status} />
            </div>
            <div className="min-w-0">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Owner
              </span>
              <p className="truncate text-sm font-semibold">{ownerName}</p>
            </div>
            <div className="min-w-0">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Owner email
              </span>
              <p className="truncate text-sm">{ownerEmail}</p>
            </div>
          </div>
          <p className="text-xs text-base-content/60">
            {status === "rejected"
              ? "This listing was rejected. Saving your changes sends it back to an admin for review."
              : "An admin reviews every listing before it appears in the catalog."}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={backHref} className="btn btn-ghost">
          Cancel
        </Link>
        <button
          type="submit"
          className="btn btn-primary sm:min-w-48"
          disabled={saving || uploading}
        >
          {saving ? (
            <span className="loading loading-spinner loading-sm" />
          ) : props.mode === "add" ? (
            "Submit for approval"
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
