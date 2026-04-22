import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/actions/admin/projectActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Image as ImageIcon,
  Tag,
  CreditCard,
  Layers,
  ArrowLeft,
  Home,
  MapPin,
  Calendar,
  User,
} from "lucide-react";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const projectId = parseInt(id);
  const project = await getProjectById(projectId);
  if (!project) notFound();

  const sections = [
    {
      title: "Basic Information",
      description:
        "Project name, location, description, status, contact details",
      href: `/admin/projects/${projectId}/edit/basic`,
      icon: Home,
      color: "bg-blue-500",
    },
    {
      title: "Project Images",
      description: "Manage gallery images – upload, delete, reorder",
      href: `/admin/projects/${projectId}/edit/images`,
      icon: ImageIcon,
      color: "bg-purple-500",
    },
    {
      title: "Amenities & Payment Plans",
      description: "Add or remove amenities, configure payment options",
      href: `/admin/projects/${projectId}/edit/basic#amenities-payment`,
      icon: Tag,
      color: "bg-green-500",
    },
    {
      title: "Unit Types",
      description: "Manage unit configurations (type, size, price, images)",
      href: `/admin/projects/${projectId}/edit/unit-types`,
      icon: Building,
      color: "bg-indigo-500",
    },
    {
      title: "Blocks & Floors",
      description:
        "Manage building blocks, floors, and floor plans (includes layout editor per floor)",
      href: `/admin/projects/${projectId}/edit/blocks`,
      icon: Layers,
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/admin/projects/${projectId}`}
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Project
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">
            Manage all aspects of{" "}
            <span className="font-medium">{project.name}</span>
          </p>
        </div>
      </div>

      {/* Project Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
          <CardDescription>
            Quick overview of current project details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Name</p>
              <p className="text-muted-foreground">{project.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">{project.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Status</p>
              <p className="capitalize text-muted-foreground">
                {project.status}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Developer</p>
              <p className="text-muted-foreground">
                {project.developer || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${section.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}
                  >
                    <section.icon
                      className={`h-5 w-5 ${section.color.replace("bg-", "text-")}`}
                    />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Important Notes */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-400">
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <p>
            • Changes to unit types, blocks, floors, or layout will affect
            existing bookings and unit availability.
          </p>
          <p>
            • Always review the impact before making changes to live projects.
          </p>
          <p>
            • For major changes, consider communicating with affected users
            first.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
