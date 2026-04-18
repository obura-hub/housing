"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle } from "lucide-react";

interface BookingFormProps {
  projectId: number;
  unitTypes: any[];
  preselectedUnitTypeId?: string;
  onSuccess?: () => void;
}

export function BookingForm({
  projectId,
  unitTypes,
  preselectedUnitTypeId,
  onSuccess,
}: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    unitTypeId: preselectedUnitTypeId || "",
    preferredMoveInDate: "",
    notes: "",
  });

  if (!session) {
    return (
      <div className="text-center p-6 border rounded-lg">
        <p className="mb-4">Please sign in to book a unit.</p>
        <Button onClick={() => router.push("/login")}>Sign In</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unitTypeId) {
      setError("Please select a unit type");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          unitTypeId: formData.unitTypeId,
          preferredMoveInDate: formData.preferredMoveInDate,
          notes: formData.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setSuccess(true);
      setFormData({ unitTypeId: "", preferredMoveInDate: "", notes: "" });
      onSuccess?.();
      setTimeout(() => router.push("/dashboard/bookings"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6 border rounded-lg bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h3 className="font-semibold text-lg">Booking Request Submitted!</h3>
        <p className="text-muted-foreground">
          We'll contact you within 24 hours to confirm.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="unitType">Unit Type *</Label>
        <Select
          value={formData.unitTypeId}
          onValueChange={(val) => setFormData({ ...formData, unitTypeId: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a unit type" />
          </SelectTrigger>
          <SelectContent>
            {unitTypes.map((ut) => (
              <SelectItem key={ut.id || ut.type} value={ut.id || ut.type}>
                {ut.type} - {ut.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="moveInDate">Preferred Move-in Date (optional)</Label>
        <Input
          type="date"
          id="moveInDate"
          value={formData.preferredMoveInDate}
          onChange={(e) =>
            setFormData({ ...formData, preferredMoveInDate: e.target.value })
          }
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Any special requirements or questions..."
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Booking Request"}
      </Button>
    </form>
  );
}
