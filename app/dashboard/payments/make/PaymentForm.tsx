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
import { AlertCircle, CreditCardIcon } from "lucide-react";
import { processPayment } from "@/lib/actions/paymentActions";

interface PaymentFormProps {
  reservationId: number;
  suggestedAmount: number;
  maxAmount: number;
  isDepositOverdue: boolean;
}

export function PaymentForm({
  reservationId,
  suggestedAmount,
  maxAmount,
  isDepositOverdue,
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
    <Card className="border-border/50 shadow-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium">
              Amount (Ksh)
            </Label>
            <Input
              id="amount"
              type="number"
              step="any" // ← fixed: accept any decimal
              min="1"
              max={maxAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              required
            />
            <p className="text-xs text-muted-foreground">
              Suggested: Ksh {suggestedAmount.toLocaleString()} • Max: Ksh{" "}
              {maxAmount.toLocaleString()}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Payment Method</Label>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Label htmlFor="mpesa" className="cursor-pointer font-normal">
                  M-Pesa
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="cursor-pointer font-normal">
                  Bank Transfer
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="cursor-pointer font-normal">
                  Cash (In‑Person)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor="reference">Transaction Reference (optional)</Label>
            <Input
              id="reference"
              placeholder="e.g., M-Pesa code or bank receipt number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          {/* Overdue warning */}
          {isDepositOverdue && (
            <Alert variant="destructive" className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <AlertDescription>
                <strong>Deposit overdue!</strong> Please pay the outstanding
                deposit immediately to avoid cancellation.
              </AlertDescription>
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              "Submit Payment"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
