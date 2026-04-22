import { notFound } from "next/navigation";

import { LayoutEditor } from "@/components/admin/LayoutEditor";
import { getFloorLayout } from "@/lib/actions/admin/layout";

interface LayoutPageProps {
  params: Promise<{ id: string; blockId: string; floorId: string }>;
}

export default async function LayoutPage({ params }: LayoutPageProps) {
  const { id, blockId, floorId } = await params;
  const projectId = parseInt(id);
  const floorData = await getFloorLayout(parseInt(floorId));
  if (!floorData) notFound();

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Layout Editor</h1>
        <p className="text-muted-foreground">
          Floor {floorData.floor.floorNumber} – Assign unit types to cells
        </p>
      </div>
      <LayoutEditor
        floorId={floorData.floor.id}
        rows={floorData.floor.rows}
        cols={floorData.floor.cols}
        initialCells={floorData.cells}
        projectId={projectId}
      />
    </div>
  );
}
