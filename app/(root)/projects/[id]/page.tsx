// app/projects/[id]/page.tsx (Server Component)
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import {
  getProjectDetails,
  getAllProjects,
} from "@/lib/actions/projectActions";
import { Container } from "@/components/ui/container";
import ProjectDetailsClient from "./ProjectDetailsClient";
import { auth } from "@/auth";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/?verify=true");
  }

  const { id } = await params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) notFound();

  const project = await getProjectDetails(projectId);
  if (!project) notFound();

  // Fetch similar projects (excluding current)
  const allProjects = await getAllProjects();
  const similarProjects = allProjects
    .filter((p) => p.id !== projectId)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      price: p.price,
      coverImage: p.coverImage || "/placeholder-project.jpg",
    }));

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />
      <Container className="py-6 md:py-10">
        <Suspense fallback={<ProjectDetailsSkeleton />}>
          <ProjectDetailsClient
            project={project}
            similarProjects={similarProjects}
          />
        </Suspense>
      </Container>
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-[400px] md:h-[500px] bg-muted rounded-xl" />
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-20 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}
