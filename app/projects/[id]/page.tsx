import { Suspense } from "react";
import { notFound } from "next/navigation";

import Link from "next/link";
import { getProjectDetails } from "@/app/lib/actions/projectDetailsActions";
import ProjectDetailsContent from "@/components/projectDetails/ProjectDetailsContent";

// This is a server component that fetches the project data
export default async function ProjectDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const project = await getProjectDetails(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="bg-gray-50 dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400 dark:text-gray-500">/</span>
              <Link
                href="/projects"
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Projects
              </Link>
              <span className="text-gray-400 dark:text-gray-500">/</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {project.name}
              </span>
            </nav>
          </div>
        </section>

        <Suspense fallback={<LoadingSkeleton />}>
          <ProjectDetailsContent project={project} />
        </Suspense>
      </main>
    </div>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
