import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import UnitSelectionClient from "./UnitSelectionClient";
import { notFound } from "next/navigation";
import { getProjectUnits } from "@/app/lib/actions/unitActions";

interface UnitSelectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function UnitSelectionPage({
  params,
}: UnitSelectionPageProps) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  const projectData = await getProjectUnits(projectId);

  if (!projectData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1">
        <Sidebar projectId={projectId.toString()} />

        {/* Main Content */}
        <main className="ml-20 lg:ml-64 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UnitSelectionClient project={projectData} projectId={id} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
