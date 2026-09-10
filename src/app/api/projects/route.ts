// FILE PATH: app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

// Server-only — no NEXT_PUBLIC_ prefix, so this never reaches the browser bundle.
const API_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
  if (!API_URL) {
    console.error("[/api/projects] API_URL env var is not set");
    return NextResponse.json(
      { error: "Server misconfiguration: API_URL is not set." },
      { status: 500 },
    );
  }

  // Public read — used by the public site as well as the admin panel.
  const qs = req.nextUrl.searchParams.toString();
  const url = `${API_URL}/api/projects${qs ? `?${qs}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (err) {
    console.error(`[/api/projects] fetch to ${url} failed:`, err);
    return NextResponse.json(
      { error: `Could not reach backend at ${API_URL}.` },
      { status: 502 },
    );
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    console.error(
      `[/api/projects] backend returned non-JSON (status ${res.status}):`,
      text.slice(0, 500),
    );
    return NextResponse.json(
      { error: "Backend returned an invalid response." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    console.error(`[/api/projects] backend responded ${res.status}:`, data);
  }

  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  if (!API_URL) {
    console.error("[/api/projects] API_URL env var is not set");
    return NextResponse.json(
      { error: "Server misconfiguration: API_URL is not set." },
      { status: 500 },
    );
  }

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const body = await req.json();

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth.headers },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error(`[/api/projects] POST to ${API_URL} failed:`, err);
    return NextResponse.json(
      { error: `Could not reach backend at ${API_URL}.` },
      { status: 502 },
    );
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    console.error(
      `[/api/projects] backend returned non-JSON (status ${res.status}):`,
      text.slice(0, 500),
    );
    return NextResponse.json(
      { error: "Backend returned an invalid response." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    console.error(
      `[/api/projects] backend POST responded ${res.status}:`,
      data,
    );
  }

  return NextResponse.json(data, { status: res.status });
}
