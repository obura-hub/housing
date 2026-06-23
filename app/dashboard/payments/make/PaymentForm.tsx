// app/dashboard/payments/make/PaymentForm.tsx

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
import { AlertCircle, Loader2 } from "lucide-react";
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
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [method, setMethod] = useState("mpesa");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpesaPrompt, setMpesaPrompt] = useState(false);

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
        `Amount cannot exceed outstanding balance of Ksh ${maxAmount.toLocaleString()}`
      );
      setIsSubmitting(false);
      return;
    }

    // Handle M-Pesa STK Push
    if (method === "mpesa") {
      const cleanedPhone = phone.replace(/\D/g, "");
      if (!cleanedPhone || cleanedPhone.length < 9) {
        setError("Please enter a valid phone number (e.g., 0712345678)");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch("/api/mpesa/stkpush", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: cleanedPhone,
            amount: amountNum,
            accountReference: `RES-${reservationId}`,
            transactionDesc: `Payment for reservation ${reservationId}`,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setMpesaPrompt(true);
          setError(null);
          // Redirect after successful STK Push
          setTimeout(() => {
            router.push(`/dashboard/bookings/${reservationId}`);
          }, 5000);
        } else {
          setError(data.message || "Failed to initiate payment. Please try again.");
          setIsSubmitting(false);
        }
      } catch (err: any) {
        console.error("Payment error:", err);
        setError("Network error. Please check your connection and try again.");
        setIsSubmitting(false);
      }
    } 
    // Handle Bank or Cash payment
    else {
      if (!reference) {
        setError("Please enter a transaction reference");
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
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount */}
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
              disabled={isSubmitting || mpesaPrompt}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Suggested: Ksh {suggestedAmount.toLocaleString()}. Max: Ksh{" "}
              {maxAmount.toLocaleString()}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <Label>Payment Method</Label>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="mt-2"
              disabled={isSubmitting || mpesaPrompt}
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

          {/* M-Pesa Phone Number - only shows when M-Pesa is selected */}
          {method === "mpesa" && !mpesaPrompt && (
            <div>
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the phone number registered with M-Pesa
              </p>
            </div>
          )}

          {/* Reference for Bank/Cash */}
          {method !== "mpesa" && (
            <div>
              <Label htmlFor="reference">Transaction Reference</Label>
              <Input
                id="reference"
                placeholder="e.g., M-Pesa code or bank receipt number"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                disabled={isSubmitting}
                required={method !== "mpesa"}
              />
            </div>
          )}

          {/* M-Pesa Prompt */}
          {mpesaPrompt && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                <div className="flex items-start gap-2">
                  <span className="text-xl">📱</span>
                  <div>
                    <p className="font-medium">STK Push Sent!</p>
                    <p className="text-sm mt-1">
                      Check your phone and enter your M-Pesa PIN to complete the payment.
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Waiting for confirmation...
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
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
            disabled={isSubmitting || mpesaPrompt} 
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : mpesaPrompt ? (
              "Waiting for confirmation..."
            ) : method === "mpesa" ? (
              `Pay Ksh ${Number(amount).toLocaleString()} with M-Pesa`
            ) : (
              "Submit Payment"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}