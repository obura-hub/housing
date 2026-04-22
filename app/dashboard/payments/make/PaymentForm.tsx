"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { processPayment } from "@/lib/actions/paymentActions";

interface PaymentFormProps {
  reservationId: number;
  suggestedAmount: number;
  maxAmount: number;
}

export function PaymentForm({
  reservationId,
  suggestedAmount,
  maxAmount,
}: PaymentFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [method, setMethod] = useState("mpesa");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      setIsSubmitting(false);
      return;
    }
    if (amountNum > maxAmount) {
      setError(
        `Amount cannot exceed outstanding balance of Ksh ${maxAmount.toLocaleString()}`,
      );
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("reservationId", reservationId.toString());
    formData.append("amount", amountNum.toString());
    formData.append("method", method);
    formData.append("reference", reference);

    try {
      await processPayment(formData);
      // Redirect handled in server action
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (Ksh)</Label>
            <Input
              id="amount"
              type="number"
              step="100"
              min="1"
              max={maxAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Suggested: Ksh {suggestedAmount.toLocaleString()}. Max: Ksh{" "}
              {maxAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <Label>Payment Method</Label>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Label htmlFor="mpesa">M-Pesa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash (In‑Person)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="reference">Transaction Reference (optional)</Label>
            <Input
              id="reference"
              placeholder="e.g., M-Pesa code or bank receipt number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Processing..." : "Submit Payment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
