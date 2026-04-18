import Link from "next/link";

import AdminProjectCard from "@/components/admin/AdminProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAdminProjects } from "@/lib/actions/admin/projectActions";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage housing projects, unit types, and layouts
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <p className="text-muted-foreground">No projects yet.</p>
          <Link href="/admin/projects/new" className="mt-4 inline-block">
            <Button variant="outline">Create your first project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <AdminProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
