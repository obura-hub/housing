"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Upload, X } from "lucide-react";
import {
  createUnitType,
  deleteUnitType,
  updateUnitType,
} from "@/lib/actions/admin/unitTypesActions";

interface UnitType {
  id: number;
  type: string;
  size: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  image: string | null;
  model3d: string | null;
  sort_order: number;
}

interface UnitTypesManagementProps {
  projectId: number;
  initialUnitTypes: UnitType[];
}

export function UnitTypesManagement({
  projectId,
  initialUnitTypes,
}: UnitTypesManagementProps) {
  const router = useRouter();
  const [unitTypes, setUnitTypes] = useState(initialUnitTypes);
  const [editing, setEditing] = useState<UnitType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    size: "",
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    image: "",
    model3d: "",
    sortOrder: unitTypes.length,
  });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      type: "",
      size: "",
      price: "",
      bedrooms: 1,
      bathrooms: 1,
      image: "",
      model3d: "",
      sortOrder: unitTypes.length,
    });
    setEditing(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (unitType: UnitType) => {
    setEditing(unitType);
    setFormData({
      type: unitType.type,
      size: unitType.size,
      price: unitType.price,
      bedrooms: unitType.bedrooms,
      bathrooms: unitType.bathrooms,
      image: unitType.image || "",
      model3d: unitType.model3d || "",
      sortOrder: unitType.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
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
        await updateUnitType(editing.id, submitFormData);
        setUnitTypes((prev) =>
          prev.map((ut) =>
            ut.id === editing.id ? { ...ut, ...formData, id: editing.id } : ut,
          ),
        );
      } else {
        await createUnitType(projectId, submitFormData);
        const newUnitType = { ...formData, id: Date.now() } as UnitType;
        setUnitTypes((prev) => [...prev, newUnitType]);
      }
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save unit type");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUnitType(id);
      setUnitTypes((prev) => prev.filter((ut) => ut.id !== id));
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to delete unit type");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Total: {unitTypes.length} unit types
        </p>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Unit Type
        </Button>
      </div>

      {unitTypes.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No unit types defined yet.</p>
          <Button variant="link" onClick={openCreateDialog} className="mt-2">
            Create your first unit type
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Bedrooms</TableHead>
                <TableHead>Bathrooms</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unitTypes.map((ut) => (
                <TableRow key={ut.id}>
                  <TableCell>
                    {ut.image ? (
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={ut.image}
                          alt={ut.type}
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
                  <TableCell className="font-medium">{ut.type}</TableCell>
                  <TableCell>{ut.size}</TableCell>
                  <TableCell>{ut.price}</TableCell>
                  <TableCell>{ut.bedrooms}</TableCell>
                  <TableCell>{ut.bathrooms}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(ut)}
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
                          <AlertDialogTitle>Delete Unit Type</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure? This action cannot be undone. Unit
                            type will be removed from the project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(ut.id)}
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
              {editing ? "Edit Unit Type" : "Add New Unit Type"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Type Name *</Label>
                <Input
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Size (e.g., 500 sqft)</Label>
                <Input
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Price (e.g., Ksh 2,500,000)</Label>
                <Input
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bedrooms: parseInt(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bathrooms: parseInt(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Unit Type Image</Label>
              <div className="mt-1">
                {formData.image ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Unit type"
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
                placeholder="https://example.com/model.glb"
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
