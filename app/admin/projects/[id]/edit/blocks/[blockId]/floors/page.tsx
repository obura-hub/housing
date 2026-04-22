import { FloorsManagement } from "@/components/admin/FloorsManagement";
import {
  getBlockById,
  getBlockFloors,
} from "@/lib/actions/admin/blockAndFloorActions";
import { notFound } from "next/navigation";

interface FloorsPageProps {
  params: Promise<{ id: string; blockId: string }>;
}

export default async function FloorsPage({ params }: FloorsPageProps) {
  const { id, blockId } = await params;
  const projectId = parseInt(id);
  const block = await getBlockById(parseInt(blockId));
  if (!block) notFound();

  const floors = await getBlockFloors(parseInt(blockId));

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Floors</h1>
        <p className="text-muted-foreground">Manage floors in {block.name}</p>
      </div>
      <FloorsManagement
        blockId={block.id}
        initialFloors={floors}
        projectId={projectId}
        blockName={block.name}
      />
    </div>
  );
}
