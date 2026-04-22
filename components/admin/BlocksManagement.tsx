"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Upload, X, Layers } from "lucide-react";
import {
  createBlock,
  deleteBlock,
  updateBlock,
} from "@/lib/actions/admin/blockAndFloorActions";

interface Block {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  model3d: string | null;
  sort_order: number;
}

interface BlocksManagementProps {
  projectId: number;
  initialBlocks: Block[];
}

export function BlocksManagement({
  projectId,
  initialBlocks,
}: BlocksManagementProps) {
  const router = useRouter();
  const [blocks, setBlocks] = useState(initialBlocks);
  const [editing, setEditing] = useState<Block | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    model3d: "",
    sortOrder: blocks.length,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      model3d: "",
      sortOrder: blocks.length,
    });
    setEditing(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (block: Block) => {
    setEditing(block);
    setFormData({
      name: block.name,
      description: block.description || "",
      image: block.image || "",
      model3d: block.model3d || "",
      sortOrder: block.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });
    const { url } = await res.json();
    setFormData((prev) => ({ ...prev, image: url }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const submitFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      submitFormData.append(key, String(value)),
    );
    try {
      if (editing) {
        await updateBlock(editing.id, submitFormData);
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === editing.id ? { ...b, ...formData, id: editing.id } : b,
          ),
        );
      } else {
        await createBlock(projectId, submitFormData);
        const newBlock = { ...formData, id: Date.now() } as Block;
        setBlocks((prev) => [...prev, newBlock]);
      }
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save block");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBlock(id);
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to delete block");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Total: {blocks.length} blocks</p>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Block
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No blocks defined yet.</p>
          <Button variant="link" onClick={openCreateDialog} className="mt-2">
            Create your first block
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Floors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell>
                    {block.image ? (
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={block.image}
                          alt={block.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          No img
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{block.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {block.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/projects/${projectId}/edit/blocks/${block.id}/floors`}
                    >
                      <Button variant="ghost" size="sm">
                        <Layers className="h-4 w-4 mr-1" /> Manage Floors
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(block)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Block</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete the block and all its floors and
                            units. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(block.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Block" : "Add New Block"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Block Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>
            <div>
              <Label>Block Image</Label>
              <div className="mt-1">
                {formData.image ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Block"
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="gap-2" asChild>
                    <label>
                      <Upload className="h-4 w-4" />
                      <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label>3D Model URL (optional)</Label>
              <Input
                value={formData.model3d}
                onChange={(e) =>
                  setFormData({ ...formData, model3d: e.target.value })
                }
                placeholder="https://example.com/block.glb"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
