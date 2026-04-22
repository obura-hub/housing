import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/actions/admin/projectActions";
import { EditProjectForm } from "./EditProjectForm";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const projectId = parseInt(id);
  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">
          Update project details, amenities, and payment plans.
        </p>
      </div>
      <EditProjectForm project={project} />
    </div>
  );
}
