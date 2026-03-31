import { notFound } from "next/navigation";
import { getUnitType } from "@/app/lib/actions/unitTypeActions";
import { getFloorsWithUnits } from "@/app/lib/actions/floorActions";
import FloorsClient from "@/components/floor/FloorLayoutClient";

interface FloorsPageProps {
  params: Promise<{ id: string; unitTypeId: string }>;
}

export default async function FloorsPage({ params }: FloorsPageProps) {
  const { id, unitTypeId } = await params;
  const projectId = parseInt(id, 10);
  const typeId = parseInt(unitTypeId, 10);

  if (isNaN(projectId) || isNaN(typeId)) notFound();

  const unitType = await getUnitType(typeId);
  if (!unitType) notFound();

  const floors = await getFloorsWithUnits(projectId, typeId);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <FloorsClient projectId={projectId} unitType={unitType} floors={floors} />
    </div>
  );
}
