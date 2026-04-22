"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X, Upload, AlertCircle } from "lucide-react";
import { updateProjectDetails } from "@/lib/actions/admin/projectActions";

interface PaymentPlan {
  plan: string;
  discount: string;
  description: string;
}

interface EditProjectFormProps {
  project: any;
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: project.name,
    location: project.location,
    address: project.address,
    description: project.description || "",
    longDescription: project.longDescription || "",
    status: project.status,
    completionDate: project.completionDate || "",
    developer: project.developer || "",
    contactEmail: project.contactEmail || "",
    contactPhone: project.contactPhone || "",
  });
  const [amenities, setAmenities] = useState<string[]>(project.amenities || []);
  const [newAmenity, setNewAmenity] = useState("");
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(
    project.paymentPlans || [],
  );
  const [newPlan, setNewPlan] = useState<PaymentPlan>({
    plan: "",
    discount: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    const updated = [...amenities];
    updated.splice(index, 1);
    setAmenities(updated);
  };

  const addPaymentPlan = () => {
    if (!newPlan.plan.trim()) return;
    setPaymentPlans([...paymentPlans, { ...newPlan }]);
    setNewPlan({ plan: "", discount: "", description: "" });
  };

  const removePaymentPlan = (index: number) => {
    const updated = [...paymentPlans];
    updated.splice(index, 1);
    setPaymentPlans(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value),
    );
    formDataToSend.append("amenities", JSON.stringify(amenities));
    formDataToSend.append("paymentPlans", JSON.stringify(paymentPlans));
    try {
      await updateProjectDetails(project.id, formDataToSend);
      router.push(`/admin/projects/${project.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Location *</Label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label>Address *</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Short Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div>
            <Label>Long Description</Label>
            <Textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows={6}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val })
                }
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
                value={formData.completionDate}
                onChange={handleChange}
                placeholder="e.g., Q4 2025"
              />
            </div>
          </div>
          <div>
            <Label>Developer</Label>
            <Input
              name="developer"
              value={formData.developer}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities Section */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Swimming pool, Gym"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
            />
            <Button type="button" onClick={addAmenity}>
              Add
            </Button>
          </div>
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenities.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {item}
                  <button
                    type="button"
                    onClick={() => removeAmenity(idx)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Plans Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Plan name (e.g., 10% Deposit)"
              value={newPlan.plan}
              onChange={(e) => setNewPlan({ ...newPlan, plan: e.target.value })}
            />
            <Input
              placeholder="Discount (e.g., 5% off)"
              value={newPlan.discount}
              onChange={(e) =>
                setNewPlan({ ...newPlan, discount: e.target.value })
              }
            />
            <Button
              type="button"
              onClick={addPaymentPlan}
              className="md:col-span-1"
            >
              Add Plan
            </Button>
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={newPlan.description}
              onChange={(e) =>
                setNewPlan({ ...newPlan, description: e.target.value })
              }
              rows={2}
            />
          </div>
          {paymentPlans.length > 0 && (
            <div className="space-y-2">
              {paymentPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">{plan.plan}</p>
                    {plan.discount && (
                      <p className="text-sm text-primary">{plan.discount}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePaymentPlan(idx)}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
