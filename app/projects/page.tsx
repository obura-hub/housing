// app/projects/page.tsx
import ProjectsClient from "@/components/projects/ProjectsClient";
import { getProjects } from "../lib/actions/projectsActions";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <ProjectsClient initialProjects={projects} />
    </div>
  );
}
