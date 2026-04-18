"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface Props {
  data: any[];
  updateData: (blocks: any[]) => void;
  next: () => void;
  prev: () => void;
}

export default function BlocksStep({
  data: blocks,
  updateData,
  next,
  prev,
}: Props) {
  const [newBlockName, setNewBlockName] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);

  const addBlock = () => {
    if (!newBlockName.trim()) return;
    updateData([
      ...blocks,
      {
        id: Date.now().toString(),
        name: newBlockName,
        description: "",
        image: "",
        model3d: "",
        sortOrder: blocks.length,
        floors: [],
      },
    ]);
    setNewBlockName("");
  };

  const removeBlock = (idx: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(idx, 1);
    updateData(newBlocks);
  };

  const updateBlockField = (idx: number, field: string, value: any) => {
    const newBlocks = [...blocks];
    newBlocks[idx][field] = value;
    updateData(newBlocks);
  };

  const handleImageUpload = async (idx: number, file: File) => {
    setUploading(idx);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { url } = await res.json();
    updateBlockField(idx, "image", url);
    setUploading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Block name (e.g., Block A, Tower 1)"
          value={newBlockName}
          onChange={(e) => setNewBlockName(e.target.value)}
        />
        <Button onClick={addBlock} className="gap-1">
          <Plus className="h-4 w-4" /> Add Block
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No blocks yet. Add one to continue.
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <Card key={block.id}>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between gap-2">
                    <Input
                      value={block.name}
                      onChange={(e) =>
                        updateBlockField(idx, "name", e.target.value)
                      }
                      placeholder="Block name"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlock(idx)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Textarea
                    value={block.description || ""}
                    onChange={(e) =>
                      updateBlockField(idx, "description", e.target.value)
                    }
                    placeholder="Block description (optional)"
                  />
                  <div>
                    <Label>Block Image</Label>
                    <div className="mt-1">
                      {block.image ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                          <Image
                            src={block.image}
                            alt={block.name}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => updateBlockField(idx, "image", "")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="gap-2" asChild>
                          <label>
                            <Upload className="h-4 w-4" />
                            <span>
                              {uploading === idx
                                ? "Uploading..."
                                : "Upload Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading !== null}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(idx, file);
                              }}
                            />
                          </label>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>3D Model URL (optional)</Label>
                    <Input
                      value={block.model3d || ""}
                      onChange={(e) =>
                        updateBlockField(idx, "model3d", e.target.value)
                      }
                      placeholder="https://example.com/block.glb"
                    />
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
