// FILE PATH: lib/slug.ts

/**
 * Converts a string into a URL-safe slug.
 * e.g. "Riverside Tower — Phase 2" -> "riverside-tower-phase-2"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumerics
    .replace(/\s+/g, "-") // spaces -> dashes
    .replace(/-+/g, "-") // collapse repeated dashes
    .replace(/^-|-$/g, ""); // trim leading/trailing dash
}

/**
 * Builds a readable, unique slug for a project by combining its
 * slugified name with its numeric id.
 * e.g. { id: 42, name: "Riverside Tower" } -> "riverside-tower-42"
 */
export function getProjectSlug(project: { id: number; name: string }): string {
  return `${slugify(project.name)}-${project.id}`;
}

/**
 * Extracts the numeric id from a project slug.
 * Returns null if the slug doesn't end in a numeric id.
 */
export function getIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}
