// app/projects/[id]/unit-types/[unitTypeId]/blocks/[blockId]/floors/page.tsx
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
  Layers,
  ChevronRight,
  Building,
  Home,
  Shield,
  ChevronDown,
} from "lucide-react";
import {
  getFloorsWithUnits,
  getUnitType,
  getBlocksForUnitType,
} from "@/lib/actions/projectActions";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloorsPageProps {
  params: Promise<{ id: string; unitTypeId: string; blockId: string }>;
}

export default async function FloorsPage({ params }: FloorsPageProps) {
  const { id, unitTypeId, blockId } = await params;
  const projectId = parseInt(id);
  const typeId = parseInt(unitTypeId);
  const currentBlockId = parseInt(blockId);
  if (isNaN(projectId) || isNaN(typeId) || isNaN(currentBlockId)) notFound();

  const unitType = await getUnitType(typeId);
  if (!unitType) notFound();

  // Fetch all blocks for this unit type
  const allBlocks = await getBlocksForUnitType(projectId, typeId);
  const currentBlock = allBlocks.find((b) => b.id === currentBlockId);
  if (!currentBlock) notFound();

  const floors = await getFloorsWithUnits(currentBlockId, typeId);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary/20 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-white/80 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/projects" className="hover:text-white">
              Projects
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/projects/${projectId}`} className="hover:text-white">
              Project
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/projects/${projectId}/unit-types/${typeId}`}
              className="hover:text-white"
            >
              {unitType.type}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">
              Block {currentBlock.name || currentBlockId}
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
              {unitType.type} Units – Block{" "}
              {currentBlock.name || currentBlockId}
            </h1>
            <p className="text-white/90 text-base max-w-2xl">
              Choose a floor to view available units. Each floor has a unique
              layout.
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
        <Suspense fallback={<FloorsSkeleton />}>
          {/* Back navigation + Block selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href={`/projects/${projectId}/unit-types/${typeId}`}>
                <ArrowLeft className="h-4 w-4" /> Back to Blocks
              </Link>
            </Button>

            {/* Block Dropdown Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Switch Block <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {allBlocks.map((block) => (
                  <DropdownMenuItem key={block.id} asChild>
                    <Link
                      href={`/projects/${projectId}/unit-types/${typeId}/blocks/${block.id}`}
                      className={cn(
                        "flex justify-between items-center w-full",
                        block.id === currentBlockId &&
                          "bg-primary/10 text-primary font-semibold",
                      )}
                    >
                      <span>Block {block.name || block.id}</span>
                      {block.id === currentBlockId && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Current Block Info Card */}
          <BlockInfoCard block={currentBlock} />

          {/* Floors Grid */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5 text-secondary" /> Floors in this
                Block
              </h2>
              <Badge variant="secondary">
                {floors.length} {floors.length === 1 ? "Floor" : "Floors"}
              </Badge>
            </div>

            {floors.length === 0 ? (
              <EmptyState projectId={projectId} unitTypeId={typeId} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {floors.map((floor, index) => (
                  <FloorCard
                    key={floor.id}
                    floor={floor}
                    projectId={projectId}
                    unitTypeId={typeId}
                    blockId={currentBlockId}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </Suspense>
      </Container>
    </div>
  );
}

// Block Info Card Component
function BlockInfoCard({ block }: { block: any }) {
  const availabilityPercent = block.totalUnits
    ? (block.availableUnits / block.totalUnits) * 100
    : 0;
  return (
    <Card className="mb-8 border-border/50 shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Block Image */}
        <div className="relative h-48 md:h-auto rounded-xl overflow-hidden bg-muted">
          {block.image ? (
            <Image
              src={block.image}
              alt={block.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </div>
        {/* Block Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-2xl font-bold">
              Block {block.name || block.id}
            </h3>
            <p className="text-muted-foreground mt-1">
              {block.description || "Modern block with excellent amenities."}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-sm">
                Total units: {block.totalUnits || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">
                Available: {block.availableUnits}
              </span>
            </div>
            {block.floorCount && (
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-sm">{block.floorCount} floors</span>
              </div>
            )}
          </div>
          {/* Progress Bar */}
          {block.totalUnits && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Occupancy</span>
                <span>{Math.round(availabilityPercent)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${availabilityPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// FloorCard, EmptyState, FloorsSkeleton remain same as before (unchanged)
// ... (include the existing FloorCard, EmptyState, FloorsSkeleton functions)
//
// // Floor Card Component (unchanged)
function FloorCard({
  floor,
  projectId,
  unitTypeId,
  blockId,
  index,
}: {
  floor: any;
  projectId: number;
  unitTypeId: number;
  blockId: number;
  index: number;
}) {
  const availabilityPercent = floor.totalUnits
    ? (floor.availableUnits / floor.totalUnits) * 100
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
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
        {floor.floorPlanImage ? (
          <Image
            src={floor.floorPlanImage}
            alt={`Floor ${floor.floorNumber} Plan`}
            fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Layers className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge
            className={cn(
              "shadow-sm",
              floor.availableUnits > 0
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {floor.availableUnits > 0
              ? `${floor.availableUnits} units left`
              : "Sold Out"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          Floor {floor.floorNumber}
          <span className="text-sm font-normal text-muted-foreground">
            Layout: {floor.rows} x {floor.cols}
          </span>
        </CardTitle>
        <CardDescription>
          {floor.description ||
            `Modern layout with ${floor.rows} rows and ${floor.cols} columns.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Home className="h-4 w-4" /> Total units: {floor.totalUnits}
          </span>
          <span className="flex items-center gap-1 text-green-600">
            Available: {floor.availableUnits}
          </span>
        </div>
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
      </CardContent>
      <CardFooter>
        <Link
          href={`/projects/${projectId}/unit-types/${unitTypeId}/blocks/${blockId}/floors/${floor.id}`}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full gap-2 group-hover:bg-primary group-hover:text-white"
            disabled={floor.availableUnits === 0}
          >
            View Units{" "}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// Empty State Component
function EmptyState({
  projectId,
  unitTypeId,
}: {
  projectId: number;
  unitTypeId: number;
}) {
  return (
    <div className="text-center py-16 border rounded-2xl bg-muted/20 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Layers className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-medium mb-1">No floors available</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        There are no floors configured for this block and unit type yet.
      </p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" asChild>
          <Link href={`/projects/${projectId}/unit-types/${unitTypeId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blocks
          </Link>
        </Button>
        <Button variant="link" asChild>
          <Link href={`/projects/${projectId}`}>View Project Details</Link>
        </Button>
      </div>
    </div>
  );
}

// Loading Skeleton
function FloorsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-muted rounded" />
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
            <div className="h-1.5 bg-muted rounded-full" />
            <div className="h-10 bg-muted rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
