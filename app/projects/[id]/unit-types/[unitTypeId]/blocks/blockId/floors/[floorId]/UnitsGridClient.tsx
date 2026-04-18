"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

interface Unit {
  id: number;
  unitNumber: string;
  status: string;
  row: number;
  col: number;
  priceAdjustment: number;
  basePrice: string;
}

interface UnitsGridClientProps {
  projectId: number;
  unitType: any;
  floor: any;
  units: Unit[];
}

export function UnitsGridClient({
  projectId,
  unitType,
  floor,
  units,
}: UnitsGridClientProps) {
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const rows = floor?.rows || 0;
  const cols = floor?.cols || 0;

  // Create a grid
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
    if (unit.status === "available") setSelectedUnit(unit);
  };

  const proceedToCheckout = () => {
    if (selectedUnit) {
      router.push(
        `/projects/${projectId}/checkout?unitId=${selectedUnit.id}&unitTypeId=${unitType.id}`,
      );
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Select Your Unit</h1>
          <p className="text-muted-foreground">
            Floor {floor?.floorNumber} – {unitType.type}
          </p>
        </div>
        {floor?.floorPlanImage && (
          <div className="relative h-24 w-48 rounded-lg overflow-hidden border">
            <Image
              src={floor.floorPlanImage}
              alt="Floor plan"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {rows === 0 || cols === 0 ? (
        <div className="text-center py-12">Layout information missing.</div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div
            className="grid gap-3 justify-start"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(90px, 110px))`,
            }}
          >
            {grid.map((row, rIdx) =>
              row.map((unit, cIdx) => {
                const isAvailable = unit && unit.status === "available";
                const isSelected = selectedUnit?.id === unit?.id;
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => unit && handleUnitClick(unit)}
                    className={`
                      aspect-square border-2 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-1 text-center
                      ${!unit ? "bg-muted/30 border-muted cursor-default" : ""}
                      ${isAvailable && !isSelected ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 hover:shadow-md hover:scale-105" : ""}
                      ${isSelected ? "ring-2 ring-primary ring-offset-2 shadow-lg bg-primary/10 border-primary" : ""}
                      ${unit && !isAvailable ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 opacity-60 cursor-not-allowed" : ""}
                    `}
                  >
                    <div className="font-mono font-bold text-sm">
                      {unit?.unitNumber || "—"}
                    </div>
                    {unit && unit.priceAdjustment !== 0 && (
                      <div className="text-[10px] text-muted-foreground">
                        {unit.priceAdjustment > 0 ? "+" : ""}
                        {unit.priceAdjustment}
                      </div>
                    )}
                    {isAvailable && (
                      <div className="text-[10px] text-green-600 mt-1">
                        Available
                      </div>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-muted/30 rounded-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Selected Unit</p>
          {selectedUnit ? (
            <div>
              <span className="font-bold text-lg">
                {selectedUnit.unitNumber}
              </span>
              <span className="ml-4 text-primary font-semibold">
                {formatPrice(unitType.price, selectedUnit.priceAdjustment)}
              </span>
            </div>
          ) : (
            <p>None</p>
          )}
        </div>
        <Button
          onClick={proceedToCheckout}
          disabled={!selectedUnit}
          className="gap-2"
        >
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
