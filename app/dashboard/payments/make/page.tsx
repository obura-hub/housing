import { redirect } from "next/navigation";

import { PaymentForm } from "./PaymentForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { getActiveReservationForPayment } from "@/lib/actions/paymentActions";

export default async function MakePaymentPage() {
  const reservation = await getActiveReservationForPayment();

  if (!reservation) {
    return (
      <div className="container max-w-2xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>No Active Booking</CardTitle>
            <CardDescription>
              You don't have an active reservation to pay for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please browse projects and make a booking first.
            </p>
            <a href="/projects" className="text-primary underline">
              Browse Projects
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const outstanding = reservation.total_price - reservation.paid_amount;
  const suggestedAmount =
    reservation.payment_plan === "installment"
      ? reservation.monthly_installment
      : outstanding;

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Make a Payment</h1>
          <p className="text-muted-foreground">
            Pay towards your {reservation.project_name} – Unit{" "}
            {reservation.unit_number}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-medium">
                Ksh {reservation.total_price.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Paid Amount:</span>
              <span className="text-green-600">
                Ksh {reservation.paid_amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Outstanding:</span>
              <span className="text-primary">
                Ksh {outstanding.toLocaleString()}
              </span>
            </div>
            {reservation.payment_plan === "installment" && (
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Your monthly installment is Ksh{" "}
                  {reservation.monthly_installment?.toLocaleString()}.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <PaymentForm
          reservationId={reservation.id}
          suggestedAmount={suggestedAmount}
          maxAmount={outstanding}
        />
      </div>
    </div>
  );
}
