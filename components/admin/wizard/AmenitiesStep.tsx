"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface Props {
  data: string[];
  updateData: (amenities: string[]) => void;
  next: () => void;
  prev: () => void;
}

export default function AmenitiesStep({
  data: amenities,
  updateData,
  next,
  prev,
}: Props) {
  const [newAmenity, setNewAmenity] = useState("");

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      updateData([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    const updated = [...amenities];
    updated.splice(index, 1);
    updateData(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Add Amenity / Feature</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="e.g., Swimming pool, Gym, 24/7 Security"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addAmenity())
            }
          />
          <Button type="button" onClick={addAmenity} size="sm">
            Add
          </Button>
        </div>
      </div>

      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/20">
          {amenities.map((item, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="gap-1 pl-2 pr-1 py-1"
            >
              {item}
              <button
                type="button"
                onClick={() => removeAmenity(idx)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prev}>
          Previous
        </Button>
        <Button onClick={next}>Next: Payment Plans</Button>
      </div>
    </div>
  );
}
