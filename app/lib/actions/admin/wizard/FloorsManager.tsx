"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: { blocks: any[]; currentBlockIndex: number };
  updateData: (block: any) => void;
  next: () => void;
  prev: () => void;
  blocks: any[];
  currentBlockIndex: number;
  setCurrentBlockIndex: (idx: number) => void;
}

export default function FloorsManager({
  data,
  updateData,
  next,
  prev,
  blocks,
  currentBlockIndex,
  setCurrentBlockIndex,
}: Props) {
  const currentBlock = blocks[currentBlockIndex];
  const floors = currentBlock.floors || [];

  const addFloor = () => {
    const newFloor = {
      floorNumber: floors.length + 1,
      rows: 1,
      cols: 1,
      cells: [],
    };
    updateData({ ...currentBlock, floors: [...floors, newFloor] });
  };

  const removeFloor = (idx: number) => {
    const newFloors = [...floors];
    newFloors.splice(idx, 1);
    updateData({ ...currentBlock, floors: newFloors });
  };

  const updateFloor = (idx: number, field: string, value: any) => {
    const newFloors = [...floors];
    newFloors[idx][field] = value;
    updateData({ ...currentBlock, floors: newFloors });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Floors for {currentBlock.name}</h2>
        <div className="flex gap-2">
          <select
            value={currentBlockIndex}
            onChange={(e) => setCurrentBlockIndex(parseInt(e.target.value))}
            className="px-3 py-1 border rounded"
          >
            {blocks.map((block, idx) => (
              <option key={idx} value={idx}>
                {block.name}
              </option>
            ))}
          </select>
          <button
            onClick={addFloor}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Floor
          </button>
        </div>
      </div>

      {floors.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No floors yet. Add one to continue.
        </p>
      ) : (
        <div className="space-y-4">
          {floors.map((floor, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Floor Number
                      </label>
                      <input
                        type="number"
                        value={floor.floorNumber}
                        onChange={(e) =>
                          updateFloor(
                            idx,
                            "floorNumber",
                            parseInt(e.target.value),
                          )
                        }
                        className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Rows (for layout)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={floor.rows}
                        onChange={(e) =>
                          updateFloor(idx, "rows", parseInt(e.target.value))
                        }
                        className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Columns (for layout)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={floor.cols}
                        onChange={(e) =>
                          updateFloor(idx, "cols", parseInt(e.target.value))
                        }
                        className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFloor(idx)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={prev}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
        >
          ← Previous
        </button>
        <button
          onClick={next}
          disabled={floors.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Next: Layout →
        </button>
      </div>
    </div>
  );
}
