// app/projects/[id]/ProjectDetailsClient.tsx (Client Component)
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Heart,
  Share2,
  Clock,
  Shield,
  Sparkles,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VerifyEmployeeButton } from "@/components/custom/VerifyEmployeeButton";

interface ProjectDetailsClientProps {
  project: any;
  similarProjects: Array<{
    id: number;
    name: string;
    location: string;
    price: string;
    coverImage: string;
  }>;
}

export default function ProjectDetailsClient({
  project,
  similarProjects,
}: ProjectDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(project.images?.[0] || "");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const unitTypesRef = useRef<HTMLDivElement>(null);

  const statusConfig: Record<string, { label: string; className: string }> = {
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
  const status = statusConfig[project.status] || statusConfig.upcoming;
  const allImages = project.images || [];

  const scrollToUnitTypes = () => {
    unitTypesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setIsImageLoaded(false);
  }, [selectedImage]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section with Image and Overlay Text */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-[500px] md:h-[600px] w-full">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={project.name}
              fill
              className={cn(
                "object-cover transition-all duration-700 cursor-pointer",
                isImageLoaded ? "scale-100 blur-0" : "scale-105 blur-sm",
              )}
              onLoadingComplete={() => setIsImageLoaded(true)}
              priority
              onClick={() =>
                openLightbox(
                  allImages.findIndex((img) => img === selectedImage),
                )
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Building className="h-24 w-24 text-muted-foreground/30" />
            </div>
          )}
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="max-w-3xl">
              <Badge
                className={`mb-3 capitalize shadow-lg ${status.className}`}
              >
                {status.label}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                {project.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> Starting from{" "}
                  {project.price}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <VerifyEmployeeButton className="bg-secondary text-primary hover:bg-secondary/90">
                  Register Interest
                </VerifyEmployeeButton>
                <Button
                  variant="outline"
                  className="bg-white/20 border-white text-white hover:bg-white/30"
                  onClick={scrollToUnitTypes}
                >
                  Browse Units <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Maximize button */}
          <button
            onClick={() =>
              openLightbox(allImages.findIndex((img) => img === selectedImage))
            }
            className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
            aria-label="View fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Thumbnail gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 px-2 mt-4">
            {allImages.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105",
                  selectedImage === img
                    ? "border-primary ring-2 ring-primary/30 shadow-md"
                    : "border-border hover:border-primary/50",
                )}
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

      {/* Lightbox Modal */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 text-white p-2 hover:bg-white/20 rounded-full transition"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            className="absolute right-4 text-white p-2 hover:bg-white/20 rounded-full transition"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div
            className="relative w-full max-w-5xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`Fullscreen ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column – Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" /> About this project
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>{project.longDescription || project.description}</p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={Home}
              label="Total Units"
              value={project.units?.toLocaleString() || 0}
              color="primary"
            />
            <StatCard
              icon={DollarSign}
              label="Starting Price"
              value={project.price}
              color="secondary"
            />
            <StatCard
              icon={Calendar}
              label="Completion"
              value={project.completionDate || "TBA"}
              color="primary"
            />
            <StatCard
              icon={Clock}
              label="Status"
              value={status.label}
              color="secondary"
            />
          </div>

          {/* Unit Types Section */}
          {project.unitTypes && project.unitTypes.length > 0 && (
            <div ref={unitTypesRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-secondary" /> Available
                  Unit Types
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollToUnitTypes}
                  className="text-primary"
                >
                  <ArrowRight className="h-4 w-4 ml-1" /> Scroll to top
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.unitTypes.map((unit: any, idx: number) => (
                  <UnitTypeCard
                    key={unit.type}
                    unit={unit}
                    projectId={project.id}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {project.amenities && project.amenities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" /> Amenities &
                Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.amenities.map((amenity: string) => (
                  <Badge
                    key={amenity}
                    variant="outline"
                    className="gap-1.5 py-1.5 px-3 bg-primary/5 border-primary/20 text-foreground"
                  >
                    <CheckCircle className="h-3 w-3 text-primary" /> {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Payment Plans */}
          {project.paymentPlans && project.paymentPlans.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" /> Flexible
                Payment Plans
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.paymentPlans.map((plan: any) => (
                  <PaymentPlanCard key={plan.plan} plan={plan} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column – Sticky Sidebar (fixed z-index) */}
        <div className="space-y-6">
          <Card className="sticky top-24 z-20 border-border/50 shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Quick Info
              </CardTitle>
              <CardDescription>Everything you need to know</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      {project.address || project.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-muted-foreground">
                      <a
                        href={`tel:${project.contactPhone}`}
                        className="hover:text-primary"
                      >
                        {project.contactPhone}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      <a
                        href={`mailto:${project.contactEmail}`}
                        className="hover:text-primary"
                      >
                        {project.contactEmail}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <VerifyEmployeeButton className="w-full gap-2 bg-primary hover:bg-primary/90">
                  Register Interest <ArrowRight className="h-4 w-4" />
                </VerifyEmployeeButton>
                <Button
                  onClick={scrollToUnitTypes}
                  variant="outline"
                  className="w-full gap-2"
                >
                  Browse Units <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full gap-2">
                  <Heart className="h-4 w-4" /> Save to Favorites
                </Button>
                <Button variant="ghost" className="w-full gap-2">
                  <Share2 className="h-4 w-4" /> Share Project
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="border-border/50 shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Location Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-primary/5">
                  <MapPin className="h-8 w-8 text-primary/40" />
                  <span className="text-xs text-muted-foreground mt-1">
                    Map view
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Neighborhood:</strong>{" "}
                {project.location}
              </p>
              <p className="text-sm text-muted-foreground">
                {project.address ||
                  `Located in the heart of ${project.location}, this development offers easy access to schools, hospitals, and shopping centers.`}
              </p>
            </CardContent>
          </Card>

          {/* County Guarantee Badge */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20 text-center">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">County-Backed Project</p>
            <p className="text-xs text-muted-foreground mt-1">
              Approved by Nairobi City County Government
            </p>
          </div>
        </div>
      </div>

      {/* Similar Projects Section */}
      {similarProjects.length > 0 && (
        <div className="pt-8 border-t border-border">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Building className="h-5 w-5 text-secondary" /> Similar Projects You
            May Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProjects.map((similar) => (
              <Link key={similar.id} href={`/projects/${similar.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all group h-full">
                  <div className="relative h-48 w-full bg-muted">
                    <Image
                      src={similar.coverImage}
                      alt={similar.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {similar.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {similar.location}
                    </p>
                    <p className="text-primary font-bold mt-2">
                      {similar.price}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components (unchanged from previous version)
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: "primary" | "secondary";
}) {
  return (
    <div className="group bg-card border border-border/50 rounded-xl p-4 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors",
          color === "primary"
            ? "bg-primary/10 group-hover:bg-primary/20"
            : "bg-secondary/20 group-hover:bg-secondary/30",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            color === "primary" ? "text-primary" : "text-secondary-foreground",
          )}
        />
      </div>
      <div
        className={cn(
          "text-xl font-bold",
          color === "primary" ? "text-primary" : "",
        )}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function UnitTypeCard({
  unit,
  projectId,
  index,
}: {
  unit: any;
  projectId: number;
  index: number;
}) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50">
      {unit.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={unit.image}
            alt={unit.type}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-start">
          {unit.type}
          <Badge variant="outline" className="bg-primary/5">
            {unit.availableUnits} left
          </Badge>
        </CardTitle>
        <CardDescription>{unit.size}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 text-primary" /> {unit.bedrooms} beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-primary" /> {unit.bathrooms} baths
          </span>
          {unit.area && (
            <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-primary" /> {unit.area} sqft
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-primary">{unit.price}</div>
        <div className="flex justify-between text-sm">
          <span>Total units: {unit.totalUnits}</span>
          <span className="text-green-600 dark:text-green-400">
            Available: {unit.availableUnits}
          </span>
        </div>
        <Link
          href={`/projects/${projectId}/unit-types/${unit.id || unit.type}`}
        >
          <Button className="w-full gap-2 group/btn">
            View Details{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function PaymentPlanCard({ plan }: { plan: any }) {
  return (
    <Card className="border-border/50 hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{plan.plan}</CardTitle>
        {plan.discount && (
          <Badge
            variant="secondary"
            className="w-fit bg-secondary text-secondary-foreground"
          >
            Save {plan.discount}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardContent>
    </Card>
  );
}
