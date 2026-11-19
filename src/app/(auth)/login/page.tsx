import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to rent equipment or manage your listings."
    >
      <Suspense fallback={<div className="skeleton h-96 w-full" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
