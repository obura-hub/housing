"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Eye, Edit, Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/actions/admin/projectActions";

export default function AdminProjectCard({ project }: { project: any }) {
  const router = useRouter();
  const firstImage = project.images?.[0] || "/placeholder-project.jpg";

  const handleDelete = async () => {
    if (
      confirm(`Delete "${project.name}"? All related data will be removed.`)
    ) {
      await deleteProject(project.id);
      router.refresh();
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={firstImage}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className="absolute top-3 right-3 bg-primary/90">
          {project.status}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{project.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{project.location}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm">
            <Home className="h-4 w-4" />
            <span>{project.units} units</span>
          </div>
          <span className="font-semibold text-primary dark:text-secondary">
            {project.price}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Link href={`/admin/projects/${project.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-1">
            <Eye className="h-3.5 w-3.5" /> View
          </Button>
        </Link>
        <Link href={`/admin/projects/${project.id}/edit`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full gap-1">
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
