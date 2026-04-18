import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, MapPin, Home } from "lucide-react";
import {
  getBlocksForUnitType,
  getUnitType,
} from "@/lib/actions/projectActions";

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

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-primary">
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{unitType.type}</span>
        </nav>

        {/* Unit Type Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {unitType.image && (
            <div className="relative w-full md:w-80 h-64 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={unitType.image}
                alt={unitType.type}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{unitType.type}</h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <Badge variant="secondary">{unitType.size}</Badge>
              <Badge variant="outline">{unitType.bedrooms} Bedrooms</Badge>
              <Badge variant="outline">{unitType.bathrooms} Bathrooms</Badge>
            </div>
            <p className="text-3xl font-bold text-primary mb-4">
              {unitType.price}
            </p>
            <p className="text-muted-foreground">
              Select a block to see available units of this type.
            </p>
          </div>
        </div>

        {/* Blocks Grid */}
        <h2 className="text-2xl font-semibold mb-6">Available Blocks</h2>
        {blocks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Building className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No blocks available with this unit type.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <Card
                key={block.id}
                className="overflow-hidden hover:shadow-lg transition-all"
              >
                {block.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={block.image}
                      alt={block.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{block.name}</CardTitle>
                  <CardDescription>
                    {block.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" /> Floors: {block.floorCount}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      Available: {block.availableUnits} units
                    </span>
                  </div>
                  <Link
                    href={`/projects/${projectId}/unit-types/${unitTypeId}/blocks/${block.id}`}
                  >
                    <Button className="w-full">View Floors</Button>
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
