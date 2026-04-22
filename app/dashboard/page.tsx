// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getUserDashboardData } from "@/lib/actions/dashboardActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  HomeIcon,
  CreditCardIcon,
  EyeIcon,
  TrendingUpIcon,
  WalletIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { activeBooking, recentPayments, stats, nextPayment } =
    await getUserDashboardData();

  const paymentProgress = activeBooking
    ? (activeBooking.paid_amount / activeBooking.total_price) * 100
    : 0;

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    confirmed: {
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    paying: {
      label: "In Progress",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    owned: {
      label: "Owned",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
  };
  const status = statusConfig[activeBooking?.status] || {
    label: activeBooking?.status || "Unknown",
    color: "bg-gray-100",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary/20 p-6 md:p-8 text-white">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name || "Resident"}!
          </h1>
          <p className="text-white/80 text-sm md:text-base mt-1">
            Track your home ownership journey, payments, and bookings.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              size="sm"
              variant="secondary"
              className="bg-secondary text-primary hover:bg-secondary/90"
              asChild
            >
              <Link href="/projects">Browse New Projects</Link>
            </Button>
            {activeBooking && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white/20 border-white text-white hover:bg-white/30"
                asChild
              >
                <Link href={`/dashboard/bookings/${activeBooking.id}`}>
                  View My Booking
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Total Paid
              <CreditCardIcon className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              Ksh {stats.total_paid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime payments
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Active Booking
              <HomeIcon className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeBooking ? (
              <>
                <div className="text-lg font-bold truncate">
                  {activeBooking.unit_number || "Unit"}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {activeBooking.project_name}
                </p>
                <Badge className={`mt-2 ${status.color}`}>{status.label}</Badge>
              </>
            ) : (
              <p className="text-muted-foreground">No active booking</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Next Payment
              <CalendarIcon className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextPayment ? (
              <>
                <div className="text-lg font-bold text-primary">
                  Ksh {nextPayment.amount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Due {new Date(nextPayment.dueDate).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No pending payments</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Booking Detailed Card */}
      {activeBooking ? (
        <Card className="overflow-hidden border-border/50 shadow-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-primary" /> Your Current Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <Badge className={status.color}>{status.label}</Badge>
                <h3 className="text-xl font-semibold mt-2">
                  {activeBooking.project_name}
                </h3>
                <p className="text-muted-foreground">
                  Unit {activeBooking.unit_number} – {activeBooking.unit_type}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                  {activeBooking.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">
                  Ksh {activeBooking.total_price?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <TrendingUpIcon className="h-4 w-4 text-primary" /> Payment
                  Progress
                </span>
                <span className="font-medium">
                  Ksh {activeBooking.paid_amount?.toLocaleString()} / Ksh{" "}
                  {activeBooking.total_price?.toLocaleString()}
                </span>
              </div>
              <Progress
                value={paymentProgress}
                className="h-2 bg-primary/20"
                indicatorClassName="bg-primary"
              />
              <p className="text-xs text-muted-foreground">
                {paymentProgress.toFixed(1)}% completed •{" "}
                {activeBooking.remaining_amount
                  ? `Remaining: Ksh ${activeBooking.remaining_amount.toLocaleString()}`
                  : ""}
              </p>
            </div>

            {/* Installment info */}
            {activeBooking.payment_plan === "installment" &&
              activeBooking.monthly_installment && (
                <div className="bg-primary/5 rounded-xl p-3 flex items-center gap-3 text-sm border border-primary/10">
                  <WalletIcon className="h-5 w-5 text-primary" />
                  <div>
                    <strong>Monthly Installment:</strong> Ksh{" "}
                    {activeBooking.monthly_installment.toLocaleString()}
                    {activeBooking.next_payment_date && (
                      <>
                        {" "}
                        • Next due:{" "}
                        {new Date(
                          activeBooking.next_payment_date,
                        ).toLocaleDateString()}
                      </>
                    )}
                  </div>
                </div>
              )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline" className="gap-1">
                <Link href={`/dashboard/bookings/${activeBooking.id}`}>
                  <EyeIcon className="h-4 w-4" /> View Details
                </Link>
              </Button>
              <Button asChild className="gap-1 bg-primary hover:bg-primary/90">
                <Link href="/dashboard/payments/make">Make Payment</Link>
              </Button>
              <Button asChild variant="secondary" className="gap-1">
                <Link href={`/projects/${activeBooking.project_id}`}>
                  <HomeIcon className="h-4 w-4" /> Project Page
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 bg-muted/20 text-center py-8">
          <CardContent>
            <HomeIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <CardTitle className="text-xl">No Active Booking</CardTitle>
            <p className="text-muted-foreground mt-1 max-w-md mx-auto">
              You haven't booked a unit yet. Start your journey to home
              ownership today.
            </p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
              <Link href="/projects">Browse Projects</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Payments */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-primary" /> Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <WalletIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No payment history yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold">
                      Ksh {payment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.payment_date).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <Badge
                    variant={
                      payment.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      payment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {payment.status === "completed" ? (
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ClockIcon className="h-3 w-3 mr-1" />
                    )}
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          {recentPayments.length > 0 && (
            <div className="mt-5 text-center">
              <Button asChild variant="link" className="text-primary">
                <Link href="/dashboard/payments">View All Transactions →</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
