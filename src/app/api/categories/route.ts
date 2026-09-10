// FILE PATH: app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const API_URL = process.env.API_URL ?? "";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/categories`, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch categories." },
        { status: res.status },
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the API." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const res = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth.headers },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the API." },
      { status: 502 },
    );
  }
}
