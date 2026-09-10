"use client";

// FILE PATH: app/admin/projects/page.tsx

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ProjectsDataTable } from "@/components/admin/projects-data-table";
import { ProjectFormDialog } from "@/components/admin/project-form-dialog";
import type { Project, ProjectFormValues } from "@/types/project";

export default function AdminProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
      const json: { data: Project[] } = await res.json();
      setProjects(json.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load projects.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    const isEditing = Boolean(editing);

    const res = editing
      ? await fetch(`/api/projects/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
      : await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

    if (!res.ok) {
      toast.error(
        isEditing ? "Failed to update project." : "Failed to create project.",
      );
      throw new Error(`Failed to save project (${res.status})`);
    }

    toast.success(isEditing ? "Project updated." : "Project created.");
    await load();
  };

  const handleDelete = async (project: Project) => {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Failed to delete project.");
      throw new Error(`Failed to delete project (${res.status})`);
    }
    toast.success("Project deleted.");
    await load();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-wide text-blue-900">
            Projects
          </h1>
          <p className="mt-1 text-sm text-steel-light">
            Manage on-going, finished, and supplied projects.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" /> Add project
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="py-16 text-center text-sm text-steel-light">
            Loading projects…
          </p>
        ) : error ? (
          <p className="py-16 text-center text-sm text-red-600">{error}</p>
        ) : (
          <ProjectsDataTable
            projects={projects}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
