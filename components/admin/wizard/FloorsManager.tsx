"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";

interface Props {
  blocks: any[];
  setBlocks: React.Dispatch<React.SetStateAction<any[]>>;
  currentBlockIndex: number;
  setCurrentBlockIndex: (idx: number) => void;
  next: () => void;
  prev: () => void;
}

export default function FloorsStep({
  blocks,
  setBlocks,
  currentBlockIndex,
  setCurrentBlockIndex,
  next,
  prev,
}: Props) {
  const [uploadingFloorIdx, setUploadingFloorIdx] = useState<number | null>(
    null,
  );

  const currentBlock = blocks[currentBlockIndex];
  const floors = currentBlock?.floors || [];

  const addFloor = () => {
    const newFloor = {
      id: Date.now().toString(),
      floorNumber: floors.length + 1,
      rows: 1,
      cols: 1,
      floorPlanImage: "",
      cells: [],
    };
    const newBlocks = [...blocks];
    newBlocks[currentBlockIndex].floors = [...floors, newFloor];
    setBlocks(newBlocks);
  };

  const removeFloor = (floorIdx: number) => {
    const newBlocks = [...blocks];
    newBlocks[currentBlockIndex].floors.splice(floorIdx, 1);
    setBlocks(newBlocks);
  };

  const updateFloor = (floorIdx: number, field: string, value: any) => {
    const newBlocks = [...blocks];
    newBlocks[currentBlockIndex].floors[floorIdx][field] = value;
    setBlocks(newBlocks);
  };

  const handleFloorPlanUpload = async (floorIdx: number, file: File) => {
    setUploadingFloorIdx(floorIdx);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { url } = await res.json();
    updateFloor(floorIdx, "floorPlanImage", url);
    setUploadingFloorIdx(null);
  };

  if (!currentBlock) {
    return <div className="text-center py-8">Please add a block first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label>Select Block</Label>
          <Select
            value={currentBlockIndex.toString()}
            onValueChange={(v) => setCurrentBlockIndex(parseInt(v))}
          >
            <SelectTrigger className="w-48">
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
        </div>
        <Button onClick={addFloor} className="gap-1">
          <Plus className="h-4 w-4" /> Add Floor
        </Button>
      </div>

      {floors.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No floors yet. Add one to continue.
        </div>
      ) : (
        <div className="space-y-4">
          {floors.map((floor: any, floorIdx: number) => (
            <Card key={floor.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Floor Number</Label>
                      <Input
                        type="number"
                        value={floor.floorNumber}
                        onChange={(e) =>
                          updateFloor(
                            floorIdx,
                            "floorNumber",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Rows (units vertically)</Label>
                      <Input
                        type="number"
                        min={1}
                        value={floor.rows}
                        onChange={(e) =>
                          updateFloor(
                            floorIdx,
                            "rows",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Columns (units horizontally)</Label>
                      <Input
                        type="number"
                        min={1}
                        value={floor.cols}
                        onChange={(e) =>
                          updateFloor(
                            floorIdx,
                            "cols",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFloor(floorIdx)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="mt-4">
                  <Label>Floor Plan Image</Label>
                  <div className="mt-1">
                    {floor.floorPlanImage ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                        <Image
                          src={floor.floorPlanImage}
                          alt={`Floor ${floor.floorNumber}`}
                          fill
                          className="object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            updateFloor(floorIdx, "floorPlanImage", "")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="gap-2" asChild>
                        <label>
                          <Upload className="h-4 w-4" />
                          <span>
                            {uploadingFloorIdx === floorIdx
                              ? "Uploading..."
                              : "Upload Floor Plan"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingFloorIdx !== null}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFloorPlanUpload(floorIdx, file);
                            }}
                          />
                        </label>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
