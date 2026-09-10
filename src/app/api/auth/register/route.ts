// FILE PATH: app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { setSessionToken } from "@/lib/session";

const API_URL = process.env.API_URL ?? "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    await setSessionToken(json.data.token);

    // Never echo the raw token back to the browser — the cookie is the
    // only place it should exist from this point forward.
    return NextResponse.json({ data: { user: json.data.user } });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the API." },
      { status: 502 },
    );
  }
}
