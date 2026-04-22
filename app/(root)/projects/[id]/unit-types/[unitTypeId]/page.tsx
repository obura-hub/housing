// app/projects/[id]/unit-types/[unitTypeId]/page.tsx (Enhanced)
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building,
  MapPin,
  Home,
  BedDouble,
  Bath,
  Ruler,
  DollarSign,
  Shield,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  getBlocksForUnitType,
  getUnitType,
  getProjectDetails,
} from "@/lib/actions/projectActions";
import { cn } from "@/lib/utils";

interface UnitTypePageProps {
  params: Promise<{ id: string; unitTypeId: string }>;
}

export default async function UnitTypePage({ params }: UnitTypePageProps) {
  const { id, unitTypeId } = await params;
  const projectId = parseInt(id);
  const typeId = parseInt(unitTypeId);
  if (isNaN(projectId) || isNaN(typeId)) notFound();

  const unitType = await getUnitType(typeId);
  if (!unitType) notFound();

  const blocks = await getBlocksForUnitType(projectId, typeId);

  // Fetch all unit types for this project (to show "Other Unit Types")
  const project = await getProjectDetails(projectId);
  const otherUnitTypes =
    project?.unitTypes?.filter((ut: any) => ut.id !== typeId) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with County Colors */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary/20 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-white/80 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/projects"
              className="hover:text-white transition-colors"
            >
              Projects
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/projects/${projectId}`}
              className="hover:text-white transition-colors"
            >
              {project?.name || "Project"}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium truncate max-w-[200px]">
              {unitType.type}
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/30">
              <Shield className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-medium text-white">
                Nairobi City County | Affordable Housing
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              {unitType.type}
            </h1>
            <p className="text-white/90 text-base max-w-2xl">
              {unitType.description ||
                "Spacious and modern design with premium finishes."}
            </p>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-8 md:h-12"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <Container className="py-10 md:py-14">
        <Suspense fallback={<UnitTypeSkeleton />}>
          {/* Unit Type Header Card */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
              {unitType.image && (
                <div className="relative h-64 md:h-auto rounded-xl overflow-hidden bg-muted shadow-md">
                  <Image
                    src={unitType.image}
                    alt={unitType.type}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {unitType.type}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className="bg-secondary/20 text-secondary-foreground"
                    >
                      {unitType.size}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <BedDouble className="h-3 w-3" /> {unitType.bedrooms} Beds
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Bath className="h-3 w-3" /> {unitType.bathrooms} Baths
                    </Badge>
                    {unitType.area && (
                      <Badge variant="outline" className="gap-1">
                        <Ruler className="h-3 w-3" /> {unitType.area} sqft
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {unitType.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    starting price
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {unitType.longDescription || unitType.description}
                </p>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="gap-2" asChild>
                    <Link href={`/projects/${projectId}`}>
                      <ArrowLeft className="h-4 w-4" /> Back to Project
                    </Link>
                  </Button>
                  <Button
                    className="gap-2 bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <Link href="#blocks">
                      Browse Blocks <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Blocks Section */}
          <div id="blocks" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Building className="h-5 w-5 text-secondary" /> Available Blocks
              </h2>
              <Badge variant="secondary" className="text-sm">
                {blocks.length} {blocks.length === 1 ? "Block" : "Blocks"}
              </Badge>
            </div>

            {blocks.length === 0 ? (
              <div className="text-center py-16 border rounded-2xl bg-muted/20 flex flex-col items-center">
                <Building className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  No blocks available
                </h3>
                <p className="text-muted-foreground text-sm">
                  This unit type is not currently assigned to any block.
                </p>
                <Button variant="link" asChild className="mt-4 text-primary">
                  <Link href={`/projects/${projectId}`}>Back to Project</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blocks.map((block, index) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    projectId={projectId}
                    unitTypeId={typeId}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Other Unit Types Section */}
          {otherUnitTypes.length > 0 && (
            <div className="mt-16 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" /> Other Unit
                  Types in This Project
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/projects/${projectId}`}>View All →</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherUnitTypes.map((unit: any) => (
                  <OtherUnitCard
                    key={unit.id}
                    unit={unit}
                    projectId={projectId}
                    currentTypeId={typeId}
                  />
                ))}
              </div>
            </div>
          )}
        </Suspense>
      </Container>
    </div>
  );
}

// Block Card Component (unchanged, but included for completeness)
function BlockCard({
  block,
  projectId,
  unitTypeId,
  index,
}: {
  block: any;
  projectId: number;
  unitTypeId: number;
  index: number;
}) {
  const availabilityPercent = block.totalUnits
    ? (block.availableUnits / block.totalUnits) * 100
    : 0;
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50",
        "animate-in fade-in slide-in-from-bottom-4 duration-500",
        index < 3 && `delay-${index * 100}`,
      )}
      style={{ animationFillMode: "backwards" }}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        {block.image ? (
          <Image
            src={block.image}
            alt={block.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge
            className={cn(
              "shadow-sm",
              block.availableUnits > 0
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {block.availableUnits > 0
              ? `${block.availableUnits} units left`
              : "Sold Out"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          {block.name}
          {block.floorCount && (
            <span className="text-sm font-normal text-muted-foreground">
              {block.floorCount} floors
            </span>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {block.description || "Modern block with excellent amenities."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Home className="h-4 w-4" /> Total: {block.totalUnits || "—"}
          </span>
          <span className="flex items-center gap-1 text-green-600">
            Available: {block.availableUnits}
          </span>
        </div>
        {block.totalUnits && (
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${availabilityPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(availabilityPercent)}% occupied</span>
              <span>{100 - Math.round(availabilityPercent)}% available</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={`/projects/${projectId}/unit-types/${unitTypeId}/blocks/${block.id}`}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full gap-2 group-hover:bg-primary group-hover:text-white"
            disabled={block.availableUnits === 0}
          >
            View Floors & Units{" "}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// New Component: Other Unit Type Card
function OtherUnitCard({
  unit,
  projectId,
  currentTypeId,
}: {
  unit: any;
  projectId: number;
  currentTypeId: number;
}) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 h-full">
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        {unit.image ? (
          <Image
            src={unit.image}
            alt={unit.type}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{unit.type}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <BedDouble className="h-3 w-3 text-primary" /> {unit.bedrooms} beds
          &nbsp;|&nbsp;
          <Bath className="h-3 w-3 text-primary" /> {unit.bathrooms} baths
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-xl font-bold text-primary">{unit.price}</div>
        <div className="text-xs text-muted-foreground mt-1">{unit.size}</div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/projects/${projectId}/unit-types/${unit.id}`}
          className="w-full"
        >
          <Button variant="outline" size="sm" className="w-full gap-1">
            View Details <ChevronRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// Loading Skeleton (updated to include other unit types skeleton)
function UnitTypeSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="bg-card rounded-2xl border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-20" />
              <div className="h-6 bg-muted rounded w-24" />
            </div>
            <div className="h-10 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="flex gap-3">
              <div className="h-10 bg-muted rounded w-32" />
              <div className="h-10 bg-muted rounded w-32" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-6">
          <div className="h-7 bg-muted rounded w-40" />
          <div className="h-5 bg-muted rounded w-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-4 space-y-3">
              <div className="h-48 bg-muted rounded-lg" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      </div>
      {/* Skeleton for Other Unit Types */}
      <div className="mt-16 pt-6 border-t">
        <div className="flex justify-between mb-6">
          <div className="h-7 bg-muted rounded w-48" />
          <div className="h-5 bg-muted rounded w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-3 space-y-2">
              <div className="h-32 bg-muted rounded-lg" />
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-8 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
