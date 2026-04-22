import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/actions/admin/projectActions";
import { BlocksManagement } from "@/components/admin/BlocksManagement";
import { getProjectBlocks } from "@/lib/actions/admin/blockAndFloorActions";

interface BlocksPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlocksPage({ params }: BlocksPageProps) {
  const { id } = await params;
  const projectId = parseInt(id);
  const project = await getProjectById(projectId);
  if (!project) notFound();

  const blocks = await getProjectBlocks(projectId);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blocks</h1>
        <p className="text-muted-foreground">
          Manage building blocks / towers for {project.name}
        </p>
      </div>
      <BlocksManagement projectId={projectId} initialBlocks={blocks} />
    </div>
  );
}
