"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MapPin,
  Calendar,
  Building,
  Home,
  DollarSign,
  CheckCircle,
  ArrowRight,
  BedDouble,
  Bath,
  Ruler,
  Phone,
  Mail,
} from "lucide-react";

interface ProjectDetailsClientProps {
  project: any; // Replace with proper type from your projectDetailsActions
}

export default function ProjectDetailsClient({
  project,
}: ProjectDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(project.images?.[0] || "");

  const statusColors: Record<string, string> = {
    ongoing:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    upcoming:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-primary">
          Projects
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{project.name}</span>
      </nav>

      {/* Hero Section with Image Gallery */}
      <div className="space-y-4">
        <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden bg-muted">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <Building className="h-24 w-24 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {project.images && project.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {project.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column – Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
              <Badge className={statusColors[project.status] || ""}>
                {project.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {project.location}
              </span>
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />{" "}
                {project.developer || "Nairobi County"}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">About this project</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Home className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {project.units?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Units</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <DollarSign className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold text-primary">
                {project.price}
              </div>
              <div className="text-xs text-muted-foreground">
                Starting Price
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="font-semibold">
                {project.completionDate || "TBA"}
              </div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Building className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="font-semibold capitalize">{project.status}</div>
              <div className="text-xs text-muted-foreground">Status</div>
            </div>
          </div>

          {/* Unit Types Section */}
          {project.unitTypes && project.unitTypes.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Available Unit Types
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.unitTypes.map((unit: any) => (
                  <Card
                    key={unit.type}
                    className="overflow-hidden hover:shadow-lg transition-all"
                  >
                    {unit.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={unit.image}
                          alt={unit.type}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{unit.type}</CardTitle>
                      <CardDescription>{unit.size}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" /> {unit.bedrooms} beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-4 w-4" /> {unit.bathrooms} baths
                        </span>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {unit.price}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total: {unit.totalUnits}</span>
                        <span className="text-green-600">
                          Available: {unit.availableUnits}
                        </span>
                      </div>
                      <Link
                        href={`/projects/${project.id}/unit-types/${unit.id || unit.type}`}
                      >
                        <Button className="w-full gap-2">
                          View Units <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {project.amenities && project.amenities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {project.amenities.map((amenity: string) => (
                  <Badge key={amenity} variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" /> {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Payment Plans */}
          {project.paymentPlans && project.paymentPlans.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.paymentPlans.map((plan: any) => (
                  <Card key={plan.plan}>
                    <CardHeader>
                      <CardTitle className="text-lg">{plan.plan}</CardTitle>
                      {plan.discount && (
                        <CardDescription>
                          {plan.discount} discount
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column – Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="text-right">{project.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact</span>
                <span>
                  <a
                    href={`mailto:${project.contactEmail}`}
                    className="text-primary"
                  >
                    {project.contactEmail}
                  </a>
                  <br />
                  <a
                    href={`tel:${project.contactPhone}`}
                    className="text-primary"
                  >
                    {project.contactPhone}
                  </a>
                </span>
              </div>
              <div className="pt-4">
                <Link href="#unit-types">
                  <Button className="w-full">Browse Units</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Map view</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.address}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
