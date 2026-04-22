// components/projects/ProjectCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Home, ArrowRight } from "lucide-react";

interface Project {
  id: number;
  name: string;
  location: string;
  price: string;
  description: string;
  status: string;
  coverImage: string | null;
  totalUnits: number;
}

export function ProjectCard({ project }: { project: Project }) {
  const statusConfig = {
    ongoing: {
      label: "Ongoing",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200",
    },
    completed: {
      label: "Completed",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
    },
    upcoming: {
      label: "Upcoming",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
    },
  };
  const status =
    statusConfig[project.status as keyof typeof statusConfig] ||
    statusConfig.upcoming;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card">
      <div className="relative h-52 w-full bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Home className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <Badge
          className={`absolute top-3 right-3 capitalize ${status.className} border shadow-sm`}
        >
          {status.label}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors">
          {project.name}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{project.location}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            <span>{project.totalUnits} units</span>
          </div>
          <div className="flex items-center gap-1 text-primary font-bold">
            <DollarSign className="h-4 w-4" />
            {project.price}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full gap-1 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
          >
            View Details{" "}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
