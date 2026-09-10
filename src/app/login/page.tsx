"use client";

// FILE PATH: app/login/page.tsx

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        // Laravel validation errors come back as { errors: { email: [...] } }
        const message =
          json.errors?.email?.[0] ?? json.message ?? "Login failed.";
        throw new Error(message);
      }

      router.push("/admin");
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
          Sign in
        </h1>
        <p className="mt-1 text-sm text-steel">Admin access only.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-steel">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-blue-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
