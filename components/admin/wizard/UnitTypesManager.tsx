"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Plus, Trash2, Edit2, Upload, X } from "lucide-react";

interface UnitType {
  id: string;
  type: string;
  size: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  model3d: string;
  sortOrder: number;
}

interface Props {
  data: UnitType[];
  updateData: (unitTypes: UnitType[]) => void;
  next: () => void;
  prev: () => void;
}

export default function UnitTypesStep({
  data: unitTypes,
  updateData,
  next,
  prev,
}: Props) {
  const [editing, setEditing] = useState<UnitType | null>(null);
  const [form, setForm] = useState<UnitType>({
    id: "",
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
    setForm({
      id: "",
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

  const saveUnitType = () => {
    if (!form.type) return;
    if (editing) {
      const updated = unitTypes.map((ut) =>
        ut.id === editing.id ? { ...form, id: editing.id } : ut,
      );
      updateData(updated);
    } else {
      updateData([...unitTypes, { ...form, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const deleteUnitType = (id: string) => {
    updateData(unitTypes.filter((ut) => ut.id !== id));
  };

  const editUnitType = (ut: UnitType) => {
    setEditing(ut);
    setForm(ut);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { url } = await res.json();
    setForm({ ...form, image: url });
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">
            {editing ? "Edit Unit Type" : "Add New Unit Type"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Type (e.g., 1 Bedroom)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <Input
              placeholder="Size (e.g., 500 sqft)"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            />
            <Input
              placeholder="Price (e.g., Ksh 2,000,000)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Bedrooms"
                value={form.bedrooms}
                onChange={(e) =>
                  setForm({ ...form, bedrooms: parseInt(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Bathrooms"
                value={form.bathrooms}
                onChange={(e) =>
                  setForm({ ...form, bathrooms: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <Label>Unit Type Image</Label>
            <div className="mt-1">
              {form.image ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  <Image
                    src={form.image}
                    alt={form.type}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setForm({ ...form, image: "" })}
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
          <div className="mt-4">
            <Label>3D Model URL (optional)</Label>
            <Input
              placeholder="https://example.com/unit-type.glb"
              value={form.model3d}
              onChange={(e) => setForm({ ...form, model3d: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {editing && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button onClick={saveUnitType}>{editing ? "Update" : "Add"}</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">Defined Unit Types</h3>
        {unitTypes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No unit types defined yet.
          </p>
        ) : (
          <div className="space-y-2">
            {unitTypes.map((ut) => (
              <div
                key={ut.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <span className="font-medium">{ut.type}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {ut.size}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {ut.price}
                  </span>
                  <span className="text-xs ml-2">
                    {ut.bedrooms} bed, {ut.bathrooms} bath
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editUnitType(ut)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUnitType(ut.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
