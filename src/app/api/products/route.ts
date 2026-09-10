// FILE PATH: app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const API_URL = process.env.API_URL ?? "";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch products." },
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
    const incomingForm = await request.formData();

    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      body: incomingForm,
      headers: auth.headers,
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
