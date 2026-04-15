import { notFound } from "next/navigation";

import { updateProject } from "@/app/lib/actions/admin/projectActions";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectById } from "@/app/lib/actions/projectsActions";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const projectId = parseInt(id, 10);
  const project = await getProjectById(projectId);
  if (!project) notFound();

  const initialData = {
    name: project.name,
    location: project.location,
    address: project.address,
    units: project.units,
    price: project.price,
    description: project.description,
    longDescription: project.longDescription || "",
    status: project.status,
    completionDate: project.completionDate || "",
    developer: project.developer || "",
    contactEmail: project.contact.email,
    contactPhone: project.contact.phone,
  };

  // Bind the project id to the action
  const updateAction = async (formData: FormData) => {
    "use server";
    await updateProject(projectId, formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Project: {project.name}
      </h1>
      <ProjectForm action={updateAction} initialData={initialData} isEdit />
    </div>
  );
}
