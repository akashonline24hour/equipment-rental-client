"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";
import { CONTACT, SITE_NAME } from "@/lib/constants";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmittedName(name || "there");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 300);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact Us"
        title={`Get in touch with ${SITE_NAME}`}
        description="Have a question about equipment listings, bookings, payments, or account roles? Send us a note."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-box border border-base-300 bg-base-100 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail size={20} />
              </span>
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="mt-1 text-sm text-base-content/75">
                  {CONTACT.email}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone size={20} />
              </span>
              <div>
                <h3 className="font-bold">Phone</h3>
                <p className="mt-1 text-sm text-base-content/75">
                  {CONTACT.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin size={20} />
              </span>
              <div>
                <h3 className="font-bold">Location</h3>
                <p className="mt-1 text-sm text-base-content/75">
                  {CONTACT.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-box border border-base-300 bg-base-100 p-6 lg:col-span-2"
        >
          {submittedName && (
            <div role="alert" className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>
                Thanks, {submittedName}! Your message has been received by{" "}
                {SITE_NAME}.
              </span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="form-control">
              <label className="label" htmlFor="contact-name">
                <span className="label-text font-medium">Your Name</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="contact-email">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="contact-subject">
              <span className="label-text font-medium">Subject</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Booking or equipment listing inquiry"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="contact-message">
              <span className="label-text font-medium">Message</span>
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us how we can help..."
              className="textarea textarea-bordered w-full"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            <Send size={16} />
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
