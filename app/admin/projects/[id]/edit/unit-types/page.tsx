import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/actions/admin/projectActions";
import { getProjectUnitTypes } from "@/lib/actions/admin/unitTypesActions";
import { UnitTypesManagement } from "@/components/admin/UnitTypesManagement";

interface UnitTypesPageProps {
  params: Promise<{ id: string }>;
}

export default async function UnitTypesPage({ params }: UnitTypesPageProps) {
  const { id } = await params;
  const projectId = parseInt(id);
  const project = await getProjectById(projectId);
  if (!project) notFound();

  const unitTypes = await getProjectUnitTypes(projectId);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Unit Types</h1>
        <p className="text-muted-foreground">
          Manage unit configurations for {project.name}
        </p>
      </div>
      <UnitTypesManagement projectId={projectId} initialUnitTypes={unitTypes} />
    </div>
  );
}
