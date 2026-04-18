import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getFloorDetails,
  getUnitsOnFloor,
  getUnitType,
} from "@/lib/actions/projectActions";
import { Container } from "@/components/ui/container";
import { UnitsGridClient } from "./UnitsGridClient";

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
  const floor = parseInt(floorId);
  if (isNaN(projectId) || isNaN(typeId) || isNaN(floor)) notFound();

  const unitType = await getUnitType(typeId);
  if (!unitType) notFound();

  const floorDetails = await getFloorDetails(floor); // implement: returns rows, cols, floorNumber, floorPlanImage
  const units = await getUnitsOnFloor(floor, typeId);

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-primary">
            Projects
          </Link>
          <span>/</span>
          <Link href={`/projects/${projectId}`} className="hover:text-primary">
            Project
          </Link>
          <span>/</span>
          <Link
            href={`/projects/${projectId}/unit-types/${unitTypeId}`}
            className="hover:text-primary"
          >
            {unitType.type}
          </Link>
          <span>/</span>
          <span>Block {blockId}</span>
          <span>/</span>
          <span className="text-foreground font-medium">
            Floor {floorDetails?.floorNumber}
          </span>
        </nav>

        <UnitsGridClient
          projectId={projectId}
          unitType={unitType}
          floor={floorDetails}
          units={units}
        />
      </Container>
    </div>
  );
}
