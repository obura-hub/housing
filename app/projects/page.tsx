import { getAllProjects } from "@/lib/actions/projectActions";
import { Container } from "@/components/ui/container";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8 md:py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Housing Projects
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore our affordable housing projects across Nairobi County
            </p>
          </div>
          <ProjectsClient initialProjects={projects} />
        </div>
      </Container>
    </div>
  );
}
