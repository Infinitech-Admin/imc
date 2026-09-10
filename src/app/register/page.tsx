"use client";

// FILE PATH: app/register/page.tsx

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const firstError = json.errors
          ? (Object.values(json.errors)[0] as string[])?.[0]
          : null;
        throw new Error(firstError ?? json.message ?? "Registration failed.");
      }

      // New accounts are always role 'user' — this page can never create
      // an admin. Send them home, not to /admin.
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-50 px-6">
      <div className="w-full max-w-sm rounded-lg border border-blue-100 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-blue-900">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-blue-900">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-900">Email</label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-900">
              Password
            </label>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
              required
            />
            <p className="mt-1 text-[11.5px] text-steel-light">
              At least 10 characters, mixed case, and a number.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-blue-900">
              Confirm password
            </label>
            <Input
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-steel">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
