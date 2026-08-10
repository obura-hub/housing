"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Project {
  id: number;
  name: string;
  location: string;
  price: string;
  coverImage: string | null;
  description: string;
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [selectedLocation, setSelectedLocation] = useState("All");

  // Extract unique locations
  const locations = useMemo(() => {
    const unique = new Set(projects.map((p) => p.location));
    return ["All", ...Array.from(unique)];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (selectedLocation === "All") return projects;
    return projects.filter((p) => p.location === selectedLocation);
  }, [projects, selectedLocation]);

  if (!projects.length) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover urban housing developments across Nairobi.
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedLocation === loc
                    ? "bg-primary text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="min-w-[300px] max-w-[320px] snap-start flex-shrink-0"
              >
                <div className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 bg-white">
                  {/* Image */}
                  <div className="relative h-[260px] w-full overflow-hidden">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Title */}
                    <div className="absolute bottom-0 p-4 text-white">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-white/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {project.location}
                      </div>
                    </div>

                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 bg-black/40 backdrop-blur-sm">
                      <Button
                        asChild
                        size="sm"
                        className="bg-white text-primary hover:bg-gray-100"
                      >
                        <Link href={`/projects/${project.id}`}>
                          View Project
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="p-4">
                    <span className="text-primary font-semibold">
                      {project.price}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 flex justify-center">
          <Button asChild size="lg">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
