"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye } from "lucide-react";
import { Project } from "@/app/lib/types/projectsTypes";
import { deleteProject } from "@/app/lib/actions/admin/projectActions";

export default function AdminProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${project.name}"? This will also delete all related data (unit types, units, etc.).`,
      )
    ) {
      await deleteProject(project.id);
      router.refresh();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {project.location}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
          <span>Units: {project.units}</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {project.price}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/projects/${project.id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <Eye className="w-4 h-4" /> View
          </Link>
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition"
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
