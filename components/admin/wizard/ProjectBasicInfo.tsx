"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import { Upload, X } from "lucide-react";

interface Props {
  data: any;
  updateData: (data: any) => void;
  next: () => void;
}

export default function ProjectDetails({ data, updateData, next }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await res.json();
      uploadedUrls.push(url);
    }
    updateData({ ...data, images: [...(data.images || []), ...uploadedUrls] });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...(data.images || [])];
    newImages.splice(index, 1);
    updateData({ ...data, images: newImages });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Project Name *</Label>
          <Input
            name="name"
            value={data.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Location *</Label>
          <Input
            name="location"
            value={data.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label>Address *</Label>
        <Input
          name="address"
          value={data.address}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Short Description</Label>
        <Textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div>
        <Label>Long Description</Label>
        <Textarea
          name="longDescription"
          value={data.longDescription}
          onChange={handleChange}
          rows={6}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Status</Label>
          <Select
            value={data.status}
            onValueChange={(val) => updateData({ ...data, status: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Completion Date</Label>
          <Input
            name="completionDate"
            value={data.completionDate}
            onChange={handleChange}
            placeholder="e.g., Q4 2025"
          />
        </div>
      </div>

      <div>
        <Label>Developer</Label>
        <Input
          name="developer"
          value={data.developer}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Contact Email</Label>
          <Input
            type="email"
            name="contactEmail"
            value={data.contactEmail}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Contact Phone</Label>
          <Input
            type="tel"
            name="contactPhone"
            value={data.contactPhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label>Project Gallery Images (up to 10)</Label>
        <div className="mt-2">
          <Button variant="outline" className="gap-2" asChild>
            <label>
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Upload Images"}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImagesUpload}
                disabled={uploading}
              />
            </label>
          </Button>
          {uploading && (
            <p className="text-sm text-muted-foreground mt-1">Uploading...</p>
          )}
        </div>
        {data.images && data.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {data.images.map((url: string, idx: number) => (
              <div
                key={idx}
                className="relative group aspect-video rounded-lg overflow-hidden border"
              >
                <Image
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
