// app/projects/[id]/unit-types/[unitTypeId]/blocks/[blockId]/floors/[floorId]/UnitsGridClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Home,
  BedDouble,
  Bath,
  Ruler,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Unit {
  id: number;
  unitNumber: string;
  status: string;
  row: number;
  col: number;
  priceAdjustment: number;
  basePrice: string;
  image?: string;
}

interface UnitsGridClientProps {
  projectId: number;
  unitType: any;
  currentFloor: any;
  units: Unit[];
  blockId: string;
  allFloors: any[];
  currentFloorId: number;
}

export function UnitsGridClient({
  projectId,
  unitType,
  currentFloor,
  units,
  blockId,
  allFloors,
  currentFloorId,
}: UnitsGridClientProps) {
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const rows = currentFloor?.rows || 0;
  const cols = currentFloor?.cols || 0;

  // Build grid
  const grid: (Unit | null)[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));
  units.forEach((unit) => {
    if (unit.row && unit.col) {
      const r = unit.row - 1;
      const c = unit.col - 1;
      if (r >= 0 && r < rows && c >= 0 && c < cols) grid[r][c] = unit;
    }
  });

  const formatPrice = (base: string, adjustment: number) => {
    const baseNum = parseFloat(base.replace(/[^0-9.-]+/g, ""));
    const total = baseNum + adjustment;
    return `Ksh ${total.toLocaleString()}`;
  };

  const handleUnitClick = (unit: Unit) => {
    if (unit.status === "available") {
      setSelectedUnit(unit);
      setIsMobilePreviewOpen(true);
    }
  };

  const proceedToCheckout = () => {
    if (selectedUnit) {
      router.push(
        `/projects/${projectId}/checkout?unitId=${selectedUnit.id}&unitTypeId=${unitType.id}`,
      );
    }
  };

  const closePreview = () => setIsMobilePreviewOpen(false);

  // Floor availability percentage
  const availabilityPercent = currentFloor.totalUnits
    ? (currentFloor.availableUnits / currentFloor.totalUnits) * 100
    : 0;

  // Preview content
  const PreviewContent = ({ unit }: { unit: Unit | null }) => {
    if (!unit) return null;
    const unitPrice = formatPrice(unitType.price, unit.priceAdjustment);
    const unitImage = unit.image || unitType.image || "/placeholder-unit.jpg";
    return (
      <div className="space-y-5">
        <div className="relative h-48 md:h-56 rounded-xl overflow-hidden bg-muted">
          <Image
            src={unitImage}
            alt={`Unit ${unit.unitNumber}`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">Unit {unit.unitNumber}</h3>
              <p className="text-muted-foreground text-sm">{unitType.type}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Available
            </Badge>
          </div>
          <div className="mt-4 text-2xl font-bold text-primary">
            {unitPrice}
          </div>
          {unit.priceAdjustment !== 0 && (
            <p className="text-xs text-muted-foreground">
              {unit.priceAdjustment > 0 ? "+" : ""}
              {unit.priceAdjustment.toLocaleString()} adjustment
            </p>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <div className="text-center">
            <BedDouble className="h-5 w-5 mx-auto text-primary" />
            <div className="text-sm font-medium mt-1">
              {unitType.bedrooms} beds
            </div>
          </div>
          <div className="text-center">
            <Bath className="h-5 w-5 mx-auto text-primary" />
            <div className="text-sm font-medium mt-1">
              {unitType.bathrooms} baths
            </div>
          </div>
          <div className="text-center">
            <Ruler className="h-5 w-5 mx-auto text-primary" />
            <div className="text-sm font-medium mt-1">
              {unitType.size || "—"}
            </div>
          </div>
        </div>
        <Button onClick={proceedToCheckout} className="w-full gap-2 mt-4">
          Select & Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Floor Info Card */}
      <Card className="border-border/50 shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Floor Plan Image */}
          <div className="relative h-48 md:h-auto rounded-xl overflow-hidden bg-muted">
            {currentFloor.floorPlanImage ? (
              <Image
                src={currentFloor.floorPlanImage}
                alt={`Floor ${currentFloor.floorNumber} Plan`}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Layers className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
          {/* Floor Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold">
                  Floor {currentFloor.floorNumber}
                </h2>
                <p className="text-muted-foreground">
                  {currentFloor.description ||
                    `Layout: ${rows} rows × ${cols} columns`}
                </p>
              </div>
              {/* Floor Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Switch Floor <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {allFloors.map((floor) => (
                    <DropdownMenuItem key={floor.id} asChild>
                      <Link
                        href={`/projects/${projectId}/unit-types/${unitType.id}/blocks/${blockId}/floors/${floor.id}`}
                        className={cn(
                          "flex justify-between items-center w-full",
                          floor.id === currentFloorId &&
                            "bg-primary/10 text-primary font-semibold",
                        )}
                      >
                        <span>Floor {floor.floorNumber}</span>
                        {floor.id === currentFloorId && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Total units: {currentFloor.totalUnits || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  Available: {currentFloor.availableUnits}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Layout: {rows} x {cols}
                </span>
              </div>
            </div>
            {/* Progress Bar */}
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
          </div>
        </div>
      </Card>

      {/* Unit Grid Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
        <div>
          <h3 className="text-xl font-semibold">Unit Layout</h3>
          <p className="text-muted-foreground text-sm">
            Click on any green unit to preview and select
          </p>
        </div>
      </div>

      {/* Main grid + preview sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unit Grid */}
        <div className="lg:col-span-2 overflow-x-auto pb-4">
          {rows === 0 || cols === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-muted/20">
              <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                Layout information missing for this floor.
              </p>
            </div>
          ) : (
            <div
              className="grid gap-3 justify-start"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(85px, 100px))`,
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((unit, cIdx) => {
                  const isAvailable = unit && unit.status === "available";
                  const isSelected = selectedUnit?.id === unit?.id;
                  const isSold = unit && unit.status === "sold";
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => unit && handleUnitClick(unit)}
                      className={cn(
                        "aspect-square border-2 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-1 text-center relative group",
                        !unit && "bg-muted/30 border-muted cursor-default",
                        isAvailable &&
                          !isSelected &&
                          "bg-green-50 dark:bg-green-950/30 border-green-300 hover:shadow-md hover:scale-105 hover:border-green-500",
                        isSelected &&
                          "ring-2 ring-primary ring-offset-2 shadow-lg bg-primary/10 border-primary",
                        isSold &&
                          "bg-red-50 dark:bg-red-950/20 border-red-200 opacity-60 cursor-not-allowed",
                      )}
                    >
                      <div className="font-mono font-bold text-sm">
                        {unit?.unitNumber || "—"}
                      </div>
                      {unit && unit.priceAdjustment !== 0 && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {unit.priceAdjustment > 0 ? "+" : ""}
                          {unit.priceAdjustment.toLocaleString()}
                        </div>
                      )}
                      {isAvailable && (
                        <div className="text-[10px] text-green-600 mt-1 font-medium">
                          Available
                        </div>
                      )}
                      {isSold && (
                        <div className="text-[10px] text-red-500 mt-1">
                          Sold
                        </div>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          )}
        </div>

        {/* Desktop Preview Panel */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Card className="p-5 border-border/50 shadow-lg">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" /> Unit Preview
              </h2>
              {selectedUnit ? (
                <PreviewContent unit={selectedUnit} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Home className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Click on any available unit to preview
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Preview Drawer */}
      {isMobilePreviewOpen && selectedUnit && (
        <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
          <div className="bg-background border-t rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Unit Preview</h3>
              <Button variant="ghost" size="icon" onClick={closePreview}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <PreviewContent unit={selectedUnit} />
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black/30 -z-10"
            onClick={closePreview}
          />
        </div>
      )}
    </div>
  );
}
