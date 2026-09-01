// Central place for environment-driven config.
// Backend is not wired up yet -- this is here so the switch to native
// `fetch` against the Laravel API is a one-line change later on.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Example of the shape we'll use once the backend is live:
//
// export async function getProjects() {
//   const res = await fetch(`${API_URL}/projects`, { cache: "no-store" });
//   if (!res.ok) throw new Error("Failed to load projects");
//   return res.json();
// }
