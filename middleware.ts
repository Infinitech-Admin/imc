// FILE PATH: middleware.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate the token is actually still good, and confirm the role —
  // a mere "cookie exists" check isn't enough since it could be stale/revoked,
  // or belong to a non-admin user hitting /admin directly by URL.
  try {
    const res = await fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const json = await res.json();

    if (json.data?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
