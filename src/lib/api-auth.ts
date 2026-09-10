// FILE PATH: lib/api-auth.ts

import { NextResponse } from "next/server";
import { authHeader } from "@/lib/session";

/**
 * Guards a route handler behind a valid session.
 * Usage:
 *   const auth = await requireAuth();
 *   if (!auth.ok) return auth.response;
 *   // auth.headers.Authorization is safe to use below
 */
export async function requireAuth(): Promise<
  | { ok: true; headers: { Authorization: string } }
  | { ok: false; response: NextResponse }
> {
  const headers = await authHeader();

  if (!headers.Authorization) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      ),
    };
  }

  return { ok: true, headers: headers as { Authorization: string } };
}
