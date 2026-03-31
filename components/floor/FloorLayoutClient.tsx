"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Home,
  MapPin,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";
import { UnitType } from "@/app/lib/types/projectsTypes";
import { FloorWithUnits, Unit } from "@/app/lib/actions/floorActions";

interface FloorsClientProps {
  projectId: number;
  unitType: UnitType;
  floors: FloorWithUnits[];
}

export default function FloorsClient({
  projectId,
  unitType,
  floors,
}: FloorsClientProps) {
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(
    floors.length > 0 ? floors[0].id : null,
  );
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const selectedFloor = floors.find((f) => f.id === selectedFloorId);

  // Determine grid dimensions from units (max row and column)
  const getGridDimensions = (units: Unit[]) => {
    let maxRow = 0;
    let maxCol = 0;
    units.forEach((unit) => {
      if (unit.positionRow && unit.positionRow > maxRow)
        maxRow = unit.positionRow;
      if (unit.positionCol && unit.positionCol > maxCol)
        maxCol = unit.positionCol;
    });
    return { rows: maxRow, cols: maxCol };
  };

  const { rows, cols } = selectedFloor
    ? getGridDimensions(selectedFloor.units)
    : { rows: 0, cols: 0 };

  // Build a 2D array for grid rendering
  const grid = selectedFloor
    ? Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) =>
          selectedFloor.units.find(
            (u) => u.positionRow === r + 1 && u.positionCol === c + 1,
          ),
        ),
      )
    : [];

  const handleUnitClick = (unit: Unit) => {
    if (unit.status !== "available") return;
    setSelectedUnit(unit);
    // Optionally navigate to checkout or open a modal
    // router.push(`/project/${projectId}/unit/${unit.id}/checkout`);
  };

  const formatPrice = (price: string, adjustment: number) => {
    const base = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    const total = base + adjustment;
    return `Ksh ${total.toLocaleString()}`;
  };

  if (floors.length === 0) {
    return (
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No units available
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            There are currently no {unitType.type} units available in this
            project.
          </p>
          <Link
            href={`/project/${projectId}`}
            className="inline-flex items-center gap-2 mt-6 text-green-600 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Back to project
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href={`/project/${projectId}`}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Project
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {unitType.type} Units
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unitType.size} | {unitType.bedrooms} bed, {unitType.bathrooms}{" "}
                bath
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
              <span className="text-sm font-medium">
                Base Price: {unitType.price}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Floor Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
            {floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => setSelectedFloorId(floor.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  selectedFloorId === floor.id
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                Floor {floor.floorNumber}
                <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                  {floor.availableUnits} avail.
                </span>
              </button>
            ))}
          </div>

          {/* Floor Layout Grid */}
          {selectedFloor && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Floor {selectedFloor.floorNumber} Layout
                </h2>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>{" "}
                    Available
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>{" "}
                    Booked/Sold
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>{" "}
                    Unavailable
                  </span>
                </div>
              </div>

              {rows === 0 || cols === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Floor layout information not available.
                </div>
              ) : (
                <div
                  className="grid gap-3 justify-start"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(80px, 100px))`,
                  }}
                >
                  {grid.map((row, rowIdx) =>
                    row.map((unit, colIdx) => {
                      const isAvailable = unit && unit.status === "available";
                      const isSelected = selectedUnit?.id === unit?.id;
                      return (
                        <button
                          key={`${rowIdx}-${colIdx}`}
                          onClick={() => unit && handleUnitClick(unit)}
                          disabled={!unit || !isAvailable}
                          className={`
                            relative p-3 rounded-xl border-2 transition-all
                            ${
                              !unit
                                ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-default"
                                : isAvailable
                                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:shadow-md hover:scale-105 cursor-pointer"
                                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 cursor-not-allowed opacity-70"
                            }
                            ${isSelected ? "ring-2 ring-green-500 ring-offset-2" : ""}
                          `}
                        >
                          <div className="text-center">
                            <div className="font-mono text-sm font-bold">
                              {unit?.unitNumber || "—"}
                            </div>
                            {unit && unit.priceAdjustment !== 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {unit.priceAdjustment > 0 ? "+" : ""}
                                {unit.priceAdjustment.toLocaleString()}
                              </div>
                            )}
                            {unit && unit.status === "available" && (
                              <div className="mt-1 text-xs text-green-600 font-medium">
                                Select
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    }),
                  )}
                </div>
              )}

              {/* Legend and summary */}
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>{selectedFloor.availableUnits}</strong> of{" "}
                    <strong>{selectedFloor.totalUnits}</strong> units available
                    on this floor
                  </div>
                  {selectedUnit && (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Selected Unit
                        </div>
                        <div className="font-bold text-lg">
                          {selectedUnit.unitNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Price</div>
                        <div className="font-semibold text-green-600">
                          {formatPrice(
                            unitType.price,
                            selectedUnit.priceAdjustment,
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/projects/${projectId}/units/${selectedUnit.id}/checkout`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Proceed
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
