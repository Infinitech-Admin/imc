// FILE PATH: app/api/uploads/chunk/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const API_URL = process.env.API_URL;

// Chunks arrive here as multipart/form-data and are forwarded as-is.
// Keeping each chunk small (see hooks/use-chunked-upload.ts, ~1MB) keeps
// this comfortably under serverless request-body limits (e.g. Vercel's ~4.5MB).
export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const form = await req.formData();

  const res = await fetch(`${API_URL}/api/uploads/chunk`, {
    method: "POST",
    body: form,
    headers: auth.headers,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
