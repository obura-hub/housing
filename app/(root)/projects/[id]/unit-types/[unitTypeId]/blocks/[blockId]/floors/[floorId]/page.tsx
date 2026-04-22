// app/projects/[id]/unit-types/[unitTypeId]/blocks/[blockId]/floors/[floorId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import {
  getFloorDetails,
  getUnitsOnFloor,
  getUnitType,
  getFloorsWithUnits, // New import
} from "@/lib/actions/projectActions";
import { Container } from "@/components/ui/container";
import { UnitsGridClient } from "./UnitsGridClient";
import { ChevronRight, Shield } from "lucide-react";

interface UnitsPageProps {
  params: Promise<{
    id: string;
    unitTypeId: string;
    blockId: string;
    floorId: string;
  }>;
}

export default async function UnitsPage({ params }: UnitsPageProps) {
  const { id, unitTypeId, blockId, floorId } = await params;
  const projectId = parseInt(id);
  const typeId = parseInt(unitTypeId);
  const currentFloorId = parseInt(floorId);
  const block = parseInt(blockId);
  if (
    isNaN(projectId) ||
    isNaN(typeId) ||
    isNaN(currentFloorId) ||
    isNaN(block)
  )
    notFound();

  const unitType = await getUnitType(typeId);
  if (!unitType) notFound();

  const floorDetails = await getFloorDetails(currentFloorId);
  const units = await getUnitsOnFloor(currentFloorId, typeId);

  // Fetch all floors for this block (to allow switching)
  const allFloors = await getFloorsWithUnits(block, typeId);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary/20 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <Container className="relative z-10">
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
            <Link
              href={`/projects/${projectId}/unit-types/${typeId}/blocks/${block}`}
              className="hover:text-white"
            >
              Block {block}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">
              Floor {floorDetails?.floorNumber}
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
              Select Your Unit
            </h1>
            <p className="text-white/90 text-base max-w-2xl">
              Floor {floorDetails?.floorNumber} – {unitType.type}. Click on any
              available unit to see details and proceed.
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

      <Container className="py-8 md:py-12">
        <Suspense fallback={<UnitsGridSkeleton />}>
          <UnitsGridClient
            projectId={projectId}
            unitType={unitType}
            currentFloor={floorDetails}
            units={units}
            blockId={block}
            allFloors={allFloors}
            currentFloorId={currentFloorId}
          />
        </Suspense>
      </Container>
    </div>
  );
}

function UnitsGridSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-muted rounded-xl" />
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
        <div className="h-24 w-48 bg-muted rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-4 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl" />
            ))}
          </div>
        </div>
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
