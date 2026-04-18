import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Image as ImageIcon,
  MapPin,
  Home,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import {
  deleteProject,
  getProjectById,
} from "@/lib/actions/admin/projectActions";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

interface ViewProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewProjectPage({
  params,
}: ViewProjectPageProps) {
  const { id } = await params;
  const projectId = parseInt(id, 10);
  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex-1">{project.name}</h1>
        <Link href={`/admin/projects/${project.id}/edit`}>
          <Button variant="outline" className="gap-1">
            <Edit className="h-4 w-4" /> Edit
          </Button>
        </Link>
        <DeleteProjectButton
          projectId={project.id}
          projectName={project.name}
          deleteAction={deleteProject}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Home className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{project.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Home className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Total Units</p>
                    <p className="text-muted-foreground">
                      {project.units.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="capitalize text-muted-foreground">
                      {project.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Completion Date</p>
                    <p className="text-muted-foreground">
                      {project.completionDate || "TBD"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Starting Price</p>
                  <p className="text-2xl font-bold text-primary">
                    {project.price}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Developer</p>
                  <p>{project.developer || "N/A"}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Email</p>
                    <p>{project.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Phone</p>
                    <p>{project.contact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Short Description</p>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              {project.longDescription && (
                <div>
                  <p className="font-medium">Long Description</p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.longDescription}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          {project.images && project.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto whitespace-nowrap pb-4">
                  <div className="flex gap-4">
                    {project.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative w-80 h-48 flex-shrink-0 rounded-lg overflow-hidden border"
                      >
                        <Image
                          src={img}
                          alt={`Project ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {project.floorPlanImages && project.floorPlanImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Floor Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.floorPlanImages.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={img}
                        alt={`Floor plan ${idx + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {project.model3dUrl && (
            <Card>
              <CardHeader>
                <CardTitle>3D Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                  {/* Embed a 3D viewer – you can use <model-viewer> or similar */}
                  <iframe
                    src={project.model3dUrl}
                    className="w-full h-full"
                    title="3D Model"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Unit Types & Availability</CardTitle>
            </CardHeader>
            <CardContent>
              {/* You can later list all unit types with counts */}
              <p className="text-muted-foreground">
                Unit breakdown will appear here once the layout is fully saved.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
