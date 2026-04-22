"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Edit2, Trash2, Upload, X, Grid3x3 } from "lucide-react";
import {
  createFloor,
  deleteFloor,
  updateFloor,
} from "@/lib/actions/admin/blockAndFloorActions";

interface Floor {
  id: number;
  floorNumber: number;
  rows: number;
  cols: number;
  floorPlanImage: string | null;
  sort_order: number;
}

interface FloorsManagementProps {
  blockId: number;
  initialFloors: Floor[];
  projectId: number;
  blockName: string;
}

export function FloorsManagement({
  blockId,
  initialFloors,
  projectId,
  blockName,
}: FloorsManagementProps) {
  const router = useRouter();
  const [floors, setFloors] = useState(initialFloors);
  const [editing, setEditing] = useState<Floor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    floorNumber: floors.length + 1,
    rows: 1,
    cols: 1,
    floorPlanImage: "",
    sortOrder: floors.length,
  });

  const resetForm = () => {
    setFormData({
      floorNumber: floors.length + 1,
      rows: 1,
      cols: 1,
      floorPlanImage: "",
      sortOrder: floors.length,
    });
    setEditing(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (floor: Floor) => {
    setEditing(floor);
    setFormData({
      floorNumber: floor.floorNumber,
      rows: floor.rows,
      cols: floor.cols,
      floorPlanImage: floor.floorPlanImage || "",
      sortOrder: floor.sort_order,
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
    setFormData((prev) => ({ ...prev, floorPlanImage: url }));
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
        await updateFloor(editing.id, submitFormData);
        setFloors((prev) =>
          prev.map((f) =>
            f.id === editing.id ? { ...f, ...formData, id: editing.id } : f,
          ),
        );
      } else {
        await createFloor(blockId, submitFormData);
        const newFloor = { ...formData, id: Date.now() } as Floor;
        setFloors((prev) => [...prev, newFloor]);
      }
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save floor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFloor(id);
      setFloors((prev) => prev.filter((f) => f.id !== id));
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to delete floor");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Total: {floors.length} floors</p>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Floor
        </Button>
      </div>

      {floors.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No floors defined yet for {blockName}.
          </p>
          <Button variant="link" onClick={openCreateDialog} className="mt-2">
            Create your first floor
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Floor Plan</TableHead>
                <TableHead>Floor Number</TableHead>
                <TableHead>Layout (Rows x Cols)</TableHead>
                <TableHead>Total Units</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {floors.map((floor) => (
                <TableRow key={floor.id}>
                  <TableCell>
                    {floor.floorPlanImage ? (
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={floor.floorPlanImage}
                          alt={`Floor ${floor.floorNumber}`}
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
                  <TableCell className="font-medium">
                    {floor.floorNumber}
                  </TableCell>
                  <TableCell>
                    {floor.rows} × {floor.cols}
                  </TableCell>
                  <TableCell>{floor.rows * floor.cols}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link
                      href={`/admin/projects/${projectId}/edit/blocks/${blockId}/floors/${floor.id}/layout`}
                    >
                      <Button variant="ghost" size="sm">
                        <Grid3x3 className="h-4 w-4 mr-1" /> Layout
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(floor)}
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
                          <AlertDialogTitle>Delete Floor</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete the floor and all its units. This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(floor.id)}
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
              {editing ? "Edit Floor" : "Add New Floor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Floor Number *</Label>
                <Input
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      floorNumber: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label>Rows (units vertically) *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.rows}
                  onChange={(e) =>
                    setFormData({ ...formData, rows: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <Label>Columns (units horizontally) *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.cols}
                  onChange={(e) =>
                    setFormData({ ...formData, cols: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label>Floor Plan Image</Label>
              <div className="mt-1">
                {formData.floorPlanImage ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.floorPlanImage}
                      alt="Floor plan"
                      fill
                      className="object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setFormData({ ...formData, floorPlanImage: "" })
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
                        {uploading ? "Uploading..." : "Upload Floor Plan"}
                      </span>
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
