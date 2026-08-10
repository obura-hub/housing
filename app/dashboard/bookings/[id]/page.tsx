import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getReservationDetails,
  cancelReservation,
} from "@/lib/actions/reservationActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  HomeIcon,
  CreditCardIcon,
  WalletIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DepositCountdownTimer } from "@/components/dashboard/DepositCountdownTimer";
import { PaymentHistory } from "@/components/dashboard/PaymentHistory";
import { CancelReservationButton } from "@/components/dashboard/CancelReservationButton";

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const reservationId = parseInt(id);
  if (isNaN(reservationId)) {
    console.log("[DEBUG] Invalid reservation ID:", id);
    notFound();
  }

  console.log("[DEBUG] Fetching reservation:", reservationId);
  const reservation = await getReservationDetails(reservationId);
  console.log("[DEBUG] Reservation data:", reservation);

  if (!reservation) {
    console.log("[DEBUG] Reservation not found or user not authorized");
    notFound();
  }

  // Compute derived values
  const outstanding = reservation.total_price - reservation.paid_amount;
  const paymentProgress =
    (reservation.paid_amount / reservation.total_price) * 100;
  const isPending = reservation.status === "pending";
  const isConfirmed = reservation.status === "confirmed";
  const isPaying = reservation.status === "paying";
  const isCompleted = reservation.status === "completed";
  const isOwned = reservation.status === "owned";
  const isCancelled = reservation.status === "cancelled";

  // Determine if cancel is allowed
  const canCancel = ["pending", "confirmed"].includes(reservation.status);

  // Status config
  const statusConfig = {
    pending: {
      label: "Pending Deposit",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: ClockIcon,
    },
    confirmed: {
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircleIcon,
    },
    paying: {
      label: "In Progress",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: TrendingUpIcon,
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircleIcon,
    },
    owned: {
      label: "Owned",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: HomeIcon,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircleIcon,
    },
  };
  const status = statusConfig[reservation.status] || {
    label: reservation.status || "Unknown",
    color: "bg-gray-100",
    icon: AlertCircleIcon,
  };
  const StatusIcon = status.icon;

  return (
    <div className="container max-w-5xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex-1">Booking Details</h1>
      </div>

      {/* Status and Basic Info */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{reservation.project_name}</h2>
          <p className="text-muted-foreground">
            Unit {reservation.unit_number} – {reservation.unit_type}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={status.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
            {isPending && (
              <DepositCountdownTimer
                reservedAt={reservation.createdAt}
                deadlineDays={2}
                className="text-sm"
              />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {canCancel && (
            <CancelReservationButton reservationId={reservation.id} />
          )}
          {!isCompleted && !isOwned && !isCancelled && (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard/payments/make">Make Payment</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Total Price
              <CreditCardIcon className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              Ksh {reservation.total_price.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Paid Amount
              <WalletIcon className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Ksh {reservation.paid_amount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Outstanding
              <TrendingUpIcon className="h-4 w-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              Ksh {outstanding.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ksh {reservation.paid_amount.toLocaleString()} paid</span>
            <span>{paymentProgress.toFixed(1)}% completed</span>
          </div>
          <Progress
            value={paymentProgress}
            className="h-2 bg-primary/20 [&>div]:bg-primary"
          />
          <p className="text-xs text-muted-foreground">
            {outstanding > 0
              ? `Remaining: Ksh ${outstanding.toLocaleString()}`
              : "Fully paid!"}
          </p>
        </CardContent>
      </Card>

      {/* Payment Plan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium capitalize">
              {reservation.payment_plan}
            </span>
          </div>
          {reservation.payment_plan === "installment" &&
            reservation.monthly_installment && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Monthly Installment
                  </span>
                  <span className="font-medium">
                    Ksh {reservation.monthly_installment.toLocaleString()}
                  </span>
                </div>
                {reservation.next_payment_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Next Payment Date
                    </span>
                    <span className="font-medium">
                      {new Date(
                        reservation.next_payment_date,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </>
            )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reserved On</span>
            <span className="font-medium">
              {new Date(reservation.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <PaymentHistory payments={reservation.payments || []} />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <Button asChild variant="outline">
          <Link href={`/projects/${reservation.project_id}`}>
            <HomeIcon className="h-4 w-4 mr-1" /> View Project
          </Link>
        </Button>
        {!isCompleted && !isOwned && !isCancelled && (
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard/payments/make">Make Payment</Link>
          </Button>
        )}
        {canCancel && (
          <CancelReservationButton reservationId={reservation.id} />
        )}
      </div>
    </div>
  );
}
