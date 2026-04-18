"use client";

import { useState, useEffect } from "react";
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

interface Props {
  blocks: any[];
  setBlocks: React.Dispatch<React.SetStateAction<any[]>>;
  unitTypes: any[];
  next: () => void;
  prev: () => void;
}

export default function LayoutStep({
  blocks,
  setBlocks,
  unitTypes,
  next,
  prev,
}: Props) {
  const [selectedBlockIdx, setSelectedBlockIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedUnitType, setSelectedUnitType] = useState(
    unitTypes[0] || null,
  );
  const [fillMode, setFillMode] = useState(false);

  const currentBlock = blocks[selectedBlockIdx];
  const currentFloor = currentBlock?.floors[selectedFloorIdx];
  const rows = currentFloor?.rows || 0;
  const cols = currentFloor?.cols || 0;
  const cells = currentFloor?.cells || [];

  // Auto-initialize cells when rows/cols change
  useEffect(() => {
    if (rows && cols && cells.length !== rows * cols) {
      const newCells = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          const unitNumber = `${currentFloor.floorNumber}${String(r).padStart(2, "0")}${String(c).padStart(2, "0")}`;
          const existing = cells.find(
            (cell: any) => cell.row === r && cell.col === c,
          );
          newCells.push(
            existing || { row: r, col: c, unitNumber, unitTypeId: null },
          );
        }
      }
      const newBlocks = [...blocks];
      newBlocks[selectedBlockIdx].floors[selectedFloorIdx].cells = newCells;
      setBlocks(newBlocks);
    }
  }, [rows, cols, currentFloor?.floorNumber]);

  const getCell = (row: number, col: number) =>
    cells.find((c: any) => c.row === row && c.col === col);

  const setCellUnitType = (
    row: number,
    col: number,
    unitTypeId: string | null,
  ) => {
    const newBlocks = [...blocks];
    const floor = newBlocks[selectedBlockIdx].floors[selectedFloorIdx];
    const cellIndex = floor.cells.findIndex(
      (c: any) => c.row === row && c.col === col,
    );
    if (cellIndex !== -1) {
      floor.cells[cellIndex].unitTypeId = unitTypeId;
      setBlocks(newBlocks);
    }
  };

  const fillAllWithSelected = () => {
    const newBlocks = [...blocks];
    const floor = newBlocks[selectedBlockIdx].floors[selectedFloorIdx];
    floor.cells = floor.cells.map((cell: any) => ({
      ...cell,
      unitTypeId: selectedUnitType?.id || null,
    }));
    setBlocks(newBlocks);
  };

  if (!currentBlock || !currentFloor) {
    return <div className="text-center py-8">Please add floors first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          <Select
            value={selectedBlockIdx.toString()}
            onValueChange={(v) => {
              setSelectedBlockIdx(parseInt(v));
              setSelectedFloorIdx(0);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {blocks.map((block, idx) => (
                <SelectItem key={block.id} value={idx.toString()}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedFloorIdx.toString()}
            onValueChange={(v) => setSelectedFloorIdx(parseInt(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentBlock.floors.map((floor: any, idx: number) => (
                <SelectItem key={floor.id} value={idx.toString()}>
                  Floor {floor.floorNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Button variant="outline" onClick={fillAllWithSelected}>
            Fill All
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
        {unitTypes.map((ut) => (
          <Badge
            key={ut.id}
            variant={selectedUnitType?.id === ut.id ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setSelectedUnitType(ut)}
          >
            {ut.type} - {ut.price}
          </Badge>
        ))}
      </div>

      <div className="overflow-x-auto">
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
                    if (fillMode)
                      setCellUnitType(row, col, selectedUnitType?.id || null);
                    else
                      setCellUnitType(
                        row,
                        col,
                        isAssigned ? null : selectedUnitType?.id || null,
                      );
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
    </div>
  );
}
