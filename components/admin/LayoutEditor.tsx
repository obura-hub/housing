"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProjectUnitTypes } from "@/lib/actions/admin/unitTypesActions";
import { updateFloorLayout } from "@/lib/actions/admin/layout";

interface Cell {
  row: number;
  col: number;
  unitNumber: string;
  unitTypeId: string | null;
  unitTypeName?: string;
  unitPrice?: string;
  existingUnitId?: number;
}

interface LayoutEditorProps {
  floorId: number;
  rows: number;
  cols: number;
  initialCells: Cell[];
  projectId: number;
}

export function LayoutEditor({
  floorId,
  rows,
  cols,
  initialCells,
  projectId,
}: LayoutEditorProps) {
  const router = useRouter();
  const [cells, setCells] = useState<Cell[]>(initialCells);
  const [unitTypes, setUnitTypes] = useState<any[]>([]);
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState<string | null>(
    null,
  );
  const [fillMode, setFillMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load unit types for this project
  useEffect(() => {
    const loadUnitTypes = async () => {
      const types = await getProjectUnitTypes(projectId);
      // Convert IDs to strings for consistent comparison
      const typesWithStringIds = types.map((t: any) => ({
        ...t,
        id: String(t.id),
      }));
      setUnitTypes(typesWithStringIds);
      if (typesWithStringIds.length > 0) {
        setSelectedUnitTypeId(typesWithStringIds[0].id);
      }
    };
    loadUnitTypes();
  }, [projectId]);

  // Ensure cells are fully populated (if initialCells missing some cells)
  useEffect(() => {
    if (cells.length !== rows * cols) {
      const newCells: Cell[] = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          const existing = cells.find(
            (cell) => cell.row === r && cell.col === c,
          );
          if (existing) {
            newCells.push(existing);
          } else {
            const unitNumber = `${String(r).padStart(2, "0")}${String(c).padStart(2, "0")}`;
            newCells.push({ row: r, col: c, unitNumber, unitTypeId: null });
          }
        }
      }
      setCells(newCells);
    }
  }, [rows, cols, cells]);

  const getCell = (row: number, col: number) =>
    cells.find((c) => c.row === row && c.col === col);

  const setCellUnitType = (
    row: number,
    col: number,
    unitTypeId: string | null,
  ) => {
    setCells((prev) =>
      prev.map((cell) =>
        cell.row === row && cell.col === col ? { ...cell, unitTypeId } : cell,
      ),
    );
  };

  const fillAllWithSelected = () => {
    if (!selectedUnitTypeId) return;
    setCells((prev) =>
      prev.map((cell) => ({ ...cell, unitTypeId: selectedUnitTypeId })),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    const cellsToSave = cells.filter(
      (cell) => cell.unitTypeId && cell.unitTypeId !== null,
    );
    try {
      await updateFloorLayout(floorId, cellsToSave);
      router.push(`/admin/projects/${projectId}/edit/blocks`);
    } catch (err: any) {
      setError(err.message || "Failed to save layout");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedUnitType = unitTypes.find((ut) => ut.id === selectedUnitTypeId);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-4 border rounded-lg bg-muted/20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Unit Type:</span>
          <Select
            value={selectedUnitTypeId || ""}
            onValueChange={setSelectedUnitTypeId}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent>
              {unitTypes.map((ut) => (
                <SelectItem key={ut.id} value={ut.id}>
                  {ut.type} - {ut.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedUnitType && (
            <Badge variant="outline" className="ml-1">
              {selectedUnitType.type}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Tabs
            value={fillMode ? "fill" : "single"}
            onValueChange={(v) => setFillMode(v === "fill")}
          >
            <TabsList>
              <TabsTrigger value="single">Single</TabsTrigger>
              <TabsTrigger value="fill">Fill Mode</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            onClick={fillAllWithSelected}
            disabled={!selectedUnitTypeId}
          >
            Fill All
          </Button>
        </div>
      </div>

      {/* Unit Grid */}
      <div className="overflow-x-auto border rounded-lg p-4 bg-card">
        <div
          className="grid gap-2 justify-start"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(90px, 110px))`,
          }}
        >
          {Array.from({ length: rows }, (_, rIdx) => {
            const row = rIdx + 1;
            return Array.from({ length: cols }, (_, cIdx) => {
              const col = cIdx + 1;
              const cell = getCell(row, col);
              const unitType = unitTypes.find(
                (ut) => ut.id === cell?.unitTypeId,
              );
              const isAssigned = !!unitType;
              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => {
                    if (fillMode && selectedUnitTypeId) {
                      setCellUnitType(row, col, selectedUnitTypeId);
                    } else if (!fillMode) {
                      setCellUnitType(
                        row,
                        col,
                        isAssigned ? null : selectedUnitTypeId,
                      );
                    }
                  }}
                  className={`aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-1 text-center ${
                    isAssigned
                      ? "bg-primary/10 border-primary/30 dark:bg-primary/20"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-xs font-mono font-medium">
                    {cell?.unitNumber || `${row}${col}`}
                  </div>
                  {unitType && (
                    <div className="text-[10px] truncate w-full">
                      {unitType.type}
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary/20 border border-primary/30 rounded"></div>{" "}
          Assigned
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-card border border-border rounded"></div>{" "}
          Empty
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-primary rounded"></div> Click
          to assign/unassign
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Layout"}
        </Button>
      </div>
    </div>
  );
}
