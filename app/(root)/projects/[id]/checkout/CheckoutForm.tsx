// app/projects/[id]/checkout/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";
import { createReservation } from "@/lib/actions/reservationActions";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  unit: any;
  projectId: number;
  userId: string;
}

export function CheckoutForm({ unit, projectId, userId }: CheckoutFormProps) {
  const router = useRouter();
  const [paymentPlan, setPaymentPlan] = useState<"full" | "installment">(
    "full",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [installmentMonths, setInstallmentMonths] = useState(60);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const totalPrice = unit.total_price;
  const downPayment = (totalPrice * downPaymentPercent) / 100;
  const remaining = totalPrice - downPayment;
  const monthlyInstallment = remaining / installmentMonths;

  const handleConfirmClick = () => {
    // Open terms modal first
    setShowTermsModal(true);
  };

  const handleAcceptTerms = async () => {
    setShowTermsModal(false);
    setTermsAccepted(true);
    await submitReservation();
  };

  const submitReservation = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createReservation({
        userId,
        projectId,
        unitId: unit.unit_id,
        unitTypeId: unit.unit_type_id,
        totalPrice,
        paymentPlan,
        monthlyInstallment:
          paymentPlan === "installment" ? monthlyInstallment : undefined,
        downPayment: paymentPlan === "installment" ? downPayment : undefined,
      });
      router.push("/dashboard?booking_success=true");
    } catch (err: any) {
      setError(
        err.message || "Failed to create reservation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="border-border/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Confirm Your Reservation</CardTitle>
          <CardDescription>
            Review unit details and choose your preferred payment plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Unit Preview Card (unchanged) */}
          <div className="bg-card rounded-xl border border-border/50 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative h-32 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted shadow-sm">
                <Image
                  src={unit.unit_type_image || "/placeholder-unit.jpg"}
                  alt={unit.unit_type}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-lg">{unit.project_name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {unit.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" /> {unit.block_name}, Floor{" "}
                      {unit.floor_number}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3 w-3 text-primary" />{" "}
                    {unit.bedrooms} beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-3 w-3 text-primary" /> {unit.bathrooms}{" "}
                    baths
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3 text-primary" /> {unit.size}
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">
                    Ksh {totalPrice.toLocaleString()}
                  </span>
                  {unit.price_adjustment !== 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {unit.price_adjustment > 0 ? "+" : ""}
                      {unit.price_adjustment.toLocaleString()} adjustment
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
              <Clock className="h-3 w-3" /> Reservation holds this unit for 7
              days
            </div>
          </div>

          {/* Payment Plan Selection (unchanged) */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Payment Plan</Label>
            <RadioGroup
              value={paymentPlan}
              onValueChange={(v) => setPaymentPlan(v as "full" | "installment")}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div
                className={cn(
                  "relative rounded-xl border-2 p-4 transition-all",
                  paymentPlan === "full"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50",
                )}
              >
                <RadioGroupItem
                  value="full"
                  id="full"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="full"
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="font-semibold">Full Payment</h4>
                    <p className="text-sm text-muted-foreground">
                      Pay total amount upfront
                    </p>
                  </div>
                  {paymentPlan === "full" && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </Label>
                <div className="mt-2 text-lg font-bold text-primary">
                  Ksh {totalPrice.toLocaleString()}
                </div>
              </div>
              <div
                className={cn(
                  "relative rounded-xl border-2 p-4 transition-all",
                  paymentPlan === "installment"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50",
                )}
              >
                <RadioGroupItem
                  value="installment"
                  id="installment"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="installment"
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="font-semibold">Installment Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      Pay deposit + monthly installments
                    </p>
                  </div>
                  {paymentPlan === "installment" && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Installment Customization (unchanged) */}
          {paymentPlan === "installment" && (
            <div className="space-y-5 p-4 rounded-xl bg-muted/20 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
              <h4 className="font-semibold flex items-center gap-2">
                Customize Your Plan
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>Down Payment ({downPaymentPercent}%)</Label>
                    <span className="font-medium">
                      Ksh {downPayment.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={[downPaymentPercent]}
                    onValueChange={(val) => setDownPaymentPercent(val[0])}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 5%, maximum 50% of total price
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>Tenure ({installmentMonths} months)</Label>
                    <span className="font-medium">
                      {Math.floor(installmentMonths / 12)} years
                    </span>
                  </div>
                  <Slider
                    value={[installmentMonths]}
                    onValueChange={(val) => setInstallmentMonths(val[0])}
                    min={12}
                    max={120}
                    step={12}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    12 to 120 months (1-10 years)
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total Price</span>
                  <span>Ksh {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment ({downPaymentPercent}%)</span>
                  <span>Ksh {downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-primary">
                  <span>Monthly Installment ({installmentMonths} months)</span>
                  <span>Ksh {monthlyInstallment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total to pay (deposit + installments)</span>
                  <span>Ksh {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="animate-in fade-in slide-in-from-top-2"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              onClick={handleConfirmClick}
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                "Confirm Reservation"
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3" />
            By confirming, you agree to our terms and conditions.
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read the following terms carefully before proceeding with
              your reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground">
              1. Reservation Agreement
            </h3>
            <p>
              By reserving this unit, you agree to hold the unit for a period of
              7 days from the date of reservation. During this period, the unit
              will be reserved exclusively for you.
            </p>

            <h3 className="font-semibold text-foreground">2. Payment Terms</h3>
            <p>
              You agree to make the required down payment within 7 days of
              reservation. Failure to do so may result in cancellation of the
              reservation. All payments are non-refundable unless otherwise
              specified by Nairobi City County.
            </p>

            <h3 className="font-semibold text-foreground">
              3. Installment Plan
            </h3>
            <p>
              If you choose the installment plan, you agree to make monthly
              payments as per the schedule. Late payments may incur penalties as
              defined in the full agreement.
            </p>

            <h3 className="font-semibold text-foreground">
              4. County Approval
            </h3>
            <p>
              All reservations are subject to final approval by Nairobi City
              County. The county reserves the right to cancel or modify
              reservations due to administrative or legal reasons.
            </p>

            <h3 className="font-semibold text-foreground">5. Data Privacy</h3>
            <p>
              Your personal data will be processed in accordance with the
              county's privacy policy. We do not share your data with third
              parties without your consent.
            </p>

            <h3 className="font-semibold text-foreground">6. Governing Law</h3>
            <p>
              These terms are governed by the laws of Kenya. Any disputes shall
              be resolved in Nairobi courts.
            </p>

            <div className="bg-muted/30 p-3 rounded-lg mt-4">
              <p className="text-xs">
                By clicking "I Accept", you confirm that you have read,
                understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowTermsModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAcceptTerms}
              className="bg-primary hover:bg-primary/90"
            >
              I Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
