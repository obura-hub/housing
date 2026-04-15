"use client";

import { useState, useEffect } from "react";

interface Props {
  data: { blocks: any[]; currentBlockIndex: number };
  updateData: (update: {
    blockIdx: number;
    floorIdx: number;
    cells: any[];
  }) => void;
  prev: () => void;
  submit: () => void;
  isLast: boolean;
  blocks: any[];
  currentBlockIndex: number;
  unitTypes: any[]; // added
}

export default function LayoutEditor({
  data,
  updateData,
  prev,
  submit,
  isLast,
  blocks,
  currentBlockIndex,
  unitTypes,
}: Props) {
  const [selectedBlockIdx, setSelectedBlockIdx] = useState(currentBlockIndex);
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

  // Initialize cells if empty
  useEffect(() => {
    if (rows && cols && (!cells || cells.length === 0)) {
      const newCells: any[] = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          const unitNumber = `${currentFloor.floorNumber}${String(r).padStart(2, "0")}${String(c).padStart(2, "0")}`;
          newCells.push({
            row: r,
            col: c,
            unitNumber,
            unitType: null,
          });
        }
      }
      updateData({
        blockIdx: selectedBlockIdx,
        floorIdx: selectedFloorIdx,
        cells: newCells,
      });
    }
  }, [rows, cols, currentFloor?.floorNumber]);

  const getCell = (row: number, col: number) => {
    return cells.find((c: any) => c.row === row && c.col === col);
  };

  const setCellUnitType = (row: number, col: number, unitType: any) => {
    const newCells = cells.map((c: any) =>
      c.row === row && c.col === col ? { ...c, unitType } : c,
    );
    updateData({
      blockIdx: selectedBlockIdx,
      floorIdx: selectedFloorIdx,
      cells: newCells,
    });
  };

  const fillAllWithSelected = () => {
    const newCells = cells.map((c: any) => ({
      ...c,
      unitType: selectedUnitType,
    }));
    updateData({
      blockIdx: selectedBlockIdx,
      floorIdx: selectedFloorIdx,
      cells: newCells,
    });
  };

  if (!currentBlock || !currentFloor) {
    return <div>No floor selected. Go back and add floors.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <select
            value={selectedBlockIdx}
            onChange={(e) => {
              setSelectedBlockIdx(parseInt(e.target.value));
              setSelectedFloorIdx(0);
            }}
            className="px-3 py-1 border rounded"
          >
            {blocks.map((block, idx) => (
              <option key={idx} value={idx}>
                {block.name}
              </option>
            ))}
          </select>
          <select
            value={selectedFloorIdx}
            onChange={(e) => setSelectedFloorIdx(parseInt(e.target.value))}
            className="ml-2 px-3 py-1 border rounded"
          >
            {currentBlock.floors.map((floor: any, idx: number) => (
              <option key={idx} value={idx}>
                Floor {floor.floorNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={fillMode}
              onChange={(e) => setFillMode(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Fill Mode (click to paint)</span>
          </label>
          <button
            onClick={fillAllWithSelected}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Fill All
          </button>
        </div>
      </div>

      {/* Unit Type Selector */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {unitTypes.map((ut, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedUnitType(ut)}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedUnitType === ut
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            {ut.type} - {ut.price}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-2 justify-start"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(80px, 100px))`,
          }}
        >
          {Array.from({ length: rows }, (_, rIdx) => {
            const row = rIdx + 1;
            return Array.from({ length: cols }, (_, cIdx) => {
              const col = cIdx + 1;
              const cell = getCell(row, col);
              const isAssigned = cell?.unitType !== null;
              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => {
                    if (fillMode) {
                      setCellUnitType(row, col, selectedUnitType);
                    } else {
                      const newType = isAssigned ? null : selectedUnitType;
                      setCellUnitType(row, col, newType);
                    }
                  }}
                  className={`
                    aspect-square border-2 rounded-lg cursor-pointer transition-all
                    ${isAssigned ? "bg-green-100 dark:bg-green-900/30 border-green-300" : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"}
                    hover:scale-105
                  `}
                >
                  <div className="p-1 text-center">
                    <div className="text-xs font-mono">
                      {cell?.unitNumber || `${row}${col}`}
                    </div>
                    {cell?.unitType && (
                      <div className="text-[10px] truncate">
                        {cell.unitType.type}
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prev}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
        >
          ← Previous
        </button>
        <button
          onClick={submit}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}
