import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join RentGear to rent equipment or list your own."
    >
      <Suspense fallback={<div className="skeleton h-160 w-full" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
