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
import { MapPin, DollarSign, Home } from "lucide-react";

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
  const statusColors = {
    ongoing:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    upcoming:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full bg-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Home className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <Badge
          className={`absolute top-3 right-3 capitalize ${statusColors[project.status as keyof typeof statusColors] || ""}`}
        >
          {project.status}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{project.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{project.location}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Home className="h-4 w-4" />
            <span>{project.totalUnits} units</span>
          </div>
          <div className="flex items-center gap-1 text-primary font-semibold">
            <DollarSign className="h-4 w-4" />
            {project.price}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
