// FILE PATH: lib/session.ts

import { cookies } from "next/headers";

const SESSION_COOKIE = "session_token";

/**
 * Reads the Sanctum token out of the httpOnly session cookie.
 * Only callable from Server Components, Route Handlers, or Server Actions —
 * never from client-side code, which is exactly the point.
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // never readable by client-side JS — the core XSS mitigation
    secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
    sameSite: "lax", // blocks the cookie being sent on cross-site POSTs (CSRF mitigation)
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days — align with your Sanctum token expiry if you set one
  });
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Builds an Authorization header for server-side calls to the Laravel API.
 * Returns an empty object if there's no session — callers should handle
 * the resulting 401 from Laravel gracefully.
 */
export async function authHeader(): Promise<Record<string, string>> {
  const token = await getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
