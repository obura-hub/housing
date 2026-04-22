"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface PaymentPlan {
  plan: string;
  discount: string;
  description: string;
}

interface Props {
  data: PaymentPlan[];
  updateData: (plans: PaymentPlan[]) => void;
  next: () => void;
  prev: () => void;
}

export default function PaymentPlansStep({
  data: plans,
  updateData,
  next,
  prev,
}: Props) {
  const [form, setForm] = useState<PaymentPlan>({
    plan: "",
    discount: "",
    description: "",
  });

  const addPlan = () => {
    if (!form.plan.trim()) return;
    updateData([...plans, { ...form }]);
    setForm({ plan: "", discount: "", description: "" });
  };

  const removePlan = (index: number) => {
    const updated = [...plans];
    updated.splice(index, 1);
    updateData(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Add Payment Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Plan Name *</Label>
              <Input
                placeholder="e.g., 10% Deposit, Monthly Installment"
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
              />
            </div>
            <div>
              <Label>Discount / Offer (optional)</Label>
              <Input
                placeholder="e.g., 5% off, 0% interest"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={2}
              placeholder="Describe the payment terms..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <Button onClick={addPlan} className="w-full">
            Add Plan
          </Button>
        </CardContent>
      </Card>

      {plans.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Added Payment Plans</h3>
          {plans.map((plan, idx) => (
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
                variant="ghost"
                size="icon"
                onClick={() => removePlan(idx)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prev}>
          Previous
        </Button>
        <Button onClick={next}>Next: Blocks</Button>
      </div>
    </div>
  );
}
