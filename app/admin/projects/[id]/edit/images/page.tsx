import { getProjectImages } from "@/lib/actions/admin/projectActions";
import { ImagesManagement } from "@/components/admin/ImagesManagement";

interface ImagesPageProps {
  params: Promise<{ id: string }>;
}

export default async function ImagesPage({ params }: ImagesPageProps) {
  const { id } = await params;
  const projectId = parseInt(id);
  const images = await getProjectImages(projectId);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Images</h1>
        <p className="text-muted-foreground">
          Manage gallery images for the project.
        </p>
      </div>
      <ImagesManagement projectId={projectId} initialImages={images} />
    </div>
  );
}
