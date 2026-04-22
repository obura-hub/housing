// app/projects/page.tsx (Server Component)
import { getAllProjects } from "@/lib/actions/projectActions";
import { Container } from "@/components/ui/container";
import { ProjectsClient } from "./ProjectsClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const session = await auth();
  if (!session?.user) {
    redirect("/?verify=true");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with County Colors */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary/20 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/30">
              <span className="text-sm font-medium text-white">
                Nairobi City County
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Affordable Housing Projects
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Explore our sustainable, county-backed housing developments across
              Nairobi. Find your dream home in vibrant communities designed for
              modern living.
            </p>
          </div>
        </Container>
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-8 md:h-12"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="white"
            ></path>
          </svg>
        </div>
      </section>

      <Container className="py-8 md:py-12">
        <ProjectsClient initialProjects={projects} />
      </Container>
    </div>
  );
}
