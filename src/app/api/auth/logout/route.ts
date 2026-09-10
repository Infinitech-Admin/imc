// FILE PATH: app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { authHeader, clearSessionToken } from "@/lib/session";

const API_URL = process.env.API_URL ?? "";

export async function POST() {
  try {
    const headers = await authHeader();

    // Best-effort revoke on the Laravel side. Even if this fails
    // (e.g. token already expired), we still clear the local cookie below —
    // the user should always be able to "log out" from their own browser.
    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      headers,
    }).catch(() => null);

    await clearSessionToken();

    return NextResponse.json({ message: "Logged out." });
  } catch {
    await clearSessionToken();
    return NextResponse.json({ message: "Logged out." });
  }
}
