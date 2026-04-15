"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any[]; // blocks array
  updateData: (blocks: any[]) => void;
  next: () => void;
  prev: () => void;
}

export default function BlocksManager({
  data: blocks,
  updateData,
  next,
  prev,
}: Props) {
  const [newBlockName, setNewBlockName] = useState("");

  const addBlock = () => {
    if (newBlockName.trim()) {
      updateData([
        ...blocks,
        {
          name: newBlockName,
          description: "",
          sortOrder: blocks.length,
          floors: [], // floors will be added in next step
        },
      ]);
      setNewBlockName("");
    }
  };

  const removeBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    updateData(newBlocks);
  };

  const updateBlock = (index: number, field: string, value: any) => {
    const newBlocks = [...blocks];
    newBlocks[index][field] = value;
    updateData(newBlocks);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newBlockName}
          onChange={(e) => setNewBlockName(e.target.value)}
          placeholder="Block name (e.g., Block A, Tower 1)"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
        />
        <button
          onClick={addBlock}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Block
        </button>
      </div>

      {blocks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No blocks yet. Add one to continue.
        </p>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={block.name}
                    onChange={(e) => updateBlock(idx, "name", e.target.value)}
                    className="text-lg font-semibold bg-transparent border border-gray-200 dark:border-gray-700 rounded px-2 py-1 w-full"
                    placeholder="Block name"
                  />
                  <input
                    type="text"
                    value={block.description || ""}
                    onChange={(e) =>
                      updateBlock(idx, "description", e.target.value)
                    }
                    placeholder="Description (optional)"
                    className="text-sm text-gray-500 bg-transparent border border-gray-200 dark:border-gray-700 rounded px-2 py-1 w-full"
                  />
                </div>
                <button
                  onClick={() => removeBlock(idx)}
                  className="text-red-500 hover:text-red-700"
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
          disabled={blocks.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Next: Floors →
        </button>
      </div>
    </div>
  );
}
