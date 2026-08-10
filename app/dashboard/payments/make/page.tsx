import { redirect } from "next/navigation";
import { getActiveReservationForPayment } from "@/lib/actions/paymentActions";
import { PaymentForm } from "./PaymentForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CalendarIcon,
  CreditCardIcon,
  HomeIcon,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";

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
            <Link href="/projects" className="text-primary underline">
              Browse Projects
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const outstanding = reservation.total_price - reservation.paid_amount;
  const isPending = reservation.status === "pending";
  const isOverdue = reservation.deposit?.isOverdue || false;
  const depositRemaining = reservation.deposit?.remaining || 0;

  // Determine suggested amount:
  // - If pending and deposit not fully paid: suggest remaining deposit
  // - If paying/confirmed: suggest monthly installment (if any) or remaining balance
  let suggestedAmount = outstanding;
  if (isPending && depositRemaining > 0) {
    suggestedAmount = Math.min(depositRemaining, outstanding);
  } else if (
    reservation.payment_plan === "installment" &&
    reservation.monthly_installment
  ) {
    suggestedAmount = Math.min(reservation.monthly_installment, outstanding);
  }

  return (
    <div className="container max-w-3xl py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CreditCardIcon className="h-7 w-7 text-primary" />
          Make a Payment
        </h1>
        <p className="text-muted-foreground">
          Pay towards your {reservation.project_name} – Unit{" "}
          {reservation.unit_number}
        </p>
      </div>

      {/* Status and Overdue Warning */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant="outline"
          className={
            isPending
              ? "bg-amber-100 text-amber-800 border-amber-200"
              : "bg-blue-100 text-blue-800 border-blue-200"
          }
        >
          {isPending ? "Pending Deposit" : "Active"}
        </Badge>
        {isOverdue && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Deposit Overdue
          </Badge>
        )}
      </div>

      {/* Order Summary Card */}
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-primary" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Project</span>
            <span className="font-medium text-right">
              {reservation.project_name}
            </span>
            <span className="text-muted-foreground">Unit</span>
            <span className="font-medium text-right">
              {reservation.unit_number}
            </span>
            <span className="text-muted-foreground">Payment Plan</span>
            <span className="font-medium text-right capitalize">
              {reservation.payment_plan}
            </span>
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <span>Total Price</span>
              <span className="font-medium">
                Ksh {reservation.total_price.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Paid Amount</span>
              <span className="text-green-600 font-medium">
                Ksh {reservation.paid_amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Outstanding Balance</span>
              <span className="text-primary">
                Ksh {outstanding.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Deposit info when pending */}
          {isPending && reservation.deposit && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <InfoIcon className="h-4 w-4 text-amber-600" />
              <AlertDescription className="space-y-1">
                <p>
                  <strong>Deposit Required:</strong> Ksh{" "}
                  {reservation.deposit.amount.toLocaleString()} (10%)
                </p>
                <p className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Due by:{" "}
                  {new Date(reservation.deposit.deadline).toLocaleDateString()}
                  {isOverdue &&
                    " ⚠️ Overdue – please pay immediately to avoid cancellation."}
                </p>
                {depositRemaining > 0 && (
                  <p>
                    Remaining deposit: Ksh {depositRemaining.toLocaleString()}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Installment info */}
          {reservation.payment_plan === "installment" &&
            reservation.monthly_installment && (
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Monthly installment: Ksh{" "}
                  {reservation.monthly_installment.toLocaleString()}
                  {reservation.next_payment_date && (
                    <>
                      {" "}
                      • Next due:{" "}
                      {new Date(
                        reservation.next_payment_date,
                      ).toLocaleDateString()}
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>

      {/* Payment Form */}
      <PaymentForm
        reservationId={reservation.id}
        suggestedAmount={suggestedAmount}
        maxAmount={outstanding}
        isDepositOverdue={isOverdue}
      />
    </div>
  );
}
