import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProjectDetails } from "@/lib/actions/projectActions";
import { Container } from "@/components/ui/container";
import ProjectDetailsClient from "./ProjectDetailsClient";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) notFound();

  const project = await getProjectDetails(projectId);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <Suspense fallback={<ProjectDetailsSkeleton />}>
          <ProjectDetailsClient project={project} />
        </Suspense>
      </Container>
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-96 bg-muted rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
