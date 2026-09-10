// FILE PATH: app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import { authHeader } from "@/lib/session";

const API_URL = process.env.API_URL ?? "";

export async function GET() {
  const headers = await authHeader();

  if (!headers.Authorization) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  try {
    const res = await fetch(`${API_URL}/api/me`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ data: null }, { status: 200 });
  }
}
