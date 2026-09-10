// FILE PATH: app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const API_URL = process.env.API_URL ?? "";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const incomingForm = await request.formData();

    // Laravel's product update route is registered as a literal POST
    // (see routes/api.php), not PUT. Do NOT add _method=PUT here —
    // Laravel's method spoofing would rewrite the effective method to
    // PUT, which has no matching route, causing a 405.
    const res = await fetch(`${API_URL}/api/products/${id}`, {
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: auth.headers,
    });

    const json = await res.json().catch(() => ({}));
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the API." },
      { status: 502 },
    );
  }
}
