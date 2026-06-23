// app/dashboard/payments/make/page.tsx

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

export default function PaymentPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("100");
  const [method, setMethod] = useState("mpesa");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpesaPrompt, setMpesaPrompt] = useState(false);

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
    if (cleaned.startsWith("254")) return cleaned;
    if (cleaned.startsWith("+254")) return cleaned.slice(1);

    return null;
  };

  const sendSTK = async () => {
    setLoading(true);
    setError(null);

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError("Enter a valid amount");
      setLoading(false);
      return;
    }

    // M-Pesa Logic
    if (method === "mpesa") {
      const formatted = formatPhone(phone);

      if (!formatted) {
        setError("Invalid phone number");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/mpesa/stkpush", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formatted,
            amount: amountNum,
            accountReference: `PAY-${Date.now()}`,
            transactionDesc: "Payment for reservation",
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Server HTTP error:", text);
          setError("Server error");
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Response:", data);

        if (data.success) {
          setMpesaPrompt(true);
          setError(null);
          setTimeout(() => {
            router.push("/dashboard/payments");
          }, 5000);
        } else {
          setError(data.message || "STK push failed");
          setLoading(false);
        }
      } catch (err: any) {
        setError("Network error: " + err.message);
        setLoading(false);
      }
    }

    // Bank / Cash
    else {
      if (!reference) {
        setError("Enter transaction reference");
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(false);
      router.push("/dashboard/payments");
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Make a Payment</h1>
          <p className="text-muted-foreground">
            Complete your payment securely
          </p>
        </div>

        <Card>
          <form onSubmit={(e) => { e.preventDefault(); sendSTK(); }}>
            <CardHeader>
              <CardTitle>💳 Payment Details</CardTitle>
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading || mpesaPrompt}
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <Label>Payment Method</Label>
                <RadioGroup
                  value={method}
                  onValueChange={setMethod}
                  className="mt-2"
                  disabled={loading || mpesaPrompt}
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

              {/* M-Pesa Phone */}
              {method === "mpesa" && !mpesaPrompt && (
                <div>
                  <Label htmlFor="phone">M-Pesa Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the phone number registered with M-Pesa
                  </p>
                </div>
              )}

              {/* Reference for Bank/Cash */}
              {(method === "bank" || method === "cash") && (
                <div>
                  <Label htmlFor="reference">Transaction Reference</Label>
                  <Input
                    id="reference"
                    placeholder="Transaction code"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    disabled={loading}
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
                disabled={loading || mpesaPrompt}
                className="w-full"
              >
                {loading ? (
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
      </div>
    </div>
  );
}