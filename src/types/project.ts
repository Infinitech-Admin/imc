// FILE PATH: types/project.ts

export type ProjectCategory = "ongoing" | "finished" | "supplied";

export interface ProjectImage {
  id: number;
  path: string;
  sort_order: number;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  category: ProjectCategory;
  location: string | null;
  year: string | null;
  description: string | null;
  images: ProjectImage[];
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormValues {
  name: string;
  category: ProjectCategory;
  location: string;
  year: string;
  description: string;
  images: string[]; // relative paths, in order
}
