// FILE PATH: app/api/projects/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const API_URL = process.env.API_URL;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Public read — used by the public site as well as the admin panel.
  const { id } = await params;
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...auth.headers },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: auth.headers,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
