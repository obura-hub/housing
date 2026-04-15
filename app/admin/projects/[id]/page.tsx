import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { deleteProject } from "@/app/lib/actions/admin/projectActions";
import { getProjectById } from "@/app/lib/actions/projectsActions";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

interface ViewProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewProjectPage({
  params,
}: ViewProjectPageProps) {
  const { id } = await params;
  const projectId = parseInt(id, 10);
  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
          {project.name}
        </h1>
        <Link
          href={`/admin/projects/${project.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="w-4 h-4" /> Edit
        </Link>
        <DeleteProjectButton
          projectId={project.id}
          projectName={project.name}
          deleteAction={deleteProject}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
            <p className="font-medium">{project.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
            <p className="font-medium">{project.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Units
            </p>
            <p className="font-medium">{project.units.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Starting Price
            </p>
            <p className="font-medium text-green-600 dark:text-green-400">
              {project.price}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium capitalize">{project.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completion Date
            </p>
            <p className="font-medium">{project.completionDate || "TBD"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Developer
            </p>
            <p className="font-medium">{project.developer || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
            <p className="font-medium">
              {project.contact.email}
              <br />
              {project.contact.phone}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Short Description
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {project.description}
          </p>
        </div>
        {project.longDescription && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Long Description
            </p>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {project.longDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
