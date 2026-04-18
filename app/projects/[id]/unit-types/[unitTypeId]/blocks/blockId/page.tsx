import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Layers } from "lucide-react";
import { getFloorsWithUnits, getUnitType } from "@/lib/actions/projectActions";

interface FloorsPageProps {
  params: Promise<{ id: string; unitTypeId: string; blockId: string }>;
}

export default async function FloorsPage({ params }: FloorsPageProps) {
  const { id, unitTypeId, blockId } = await params;
  const projectId = parseInt(id);
  const typeId = parseInt(unitTypeId);
  const block = parseInt(blockId);
  if (isNaN(projectId) || isNaN(typeId) || isNaN(block)) notFound();

  const unitType = await getUnitType(typeId);
  if (!unitType) notFound();

  const floors = await getFloorsWithUnits(block, typeId);

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        {/* Breadcrumb */}
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
          <span className="text-foreground font-medium">Block {block}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Select a Floor</h1>
          <p className="text-muted-foreground mt-1">
            {unitType.type} units in Block {block}
          </p>
        </div>

        {floors.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No floors available for this block and unit type.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floors.map((floor) => (
              <Card
                key={floor.id}
                className="overflow-hidden hover:shadow-lg transition-all"
              >
                {floor.floorPlanImage && (
                  <div className="relative h-40 w-full bg-muted">
                    <Image
                      src={floor.floorPlanImage}
                      alt={`Floor ${floor.floorNumber}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>Floor {floor.floorNumber}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      Layout: {floor.rows} x {floor.cols}
                    </span>
                    <span className="text-green-600">
                      {floor.availableUnits} / {floor.totalUnits} available
                    </span>
                  </div>
                  <Link
                    href={`/projects/${projectId}/unit-types/${unitTypeId}/blocks/${block}/floors/${floor.id}`}
                  >
                    <Button className="w-full">View Units</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
