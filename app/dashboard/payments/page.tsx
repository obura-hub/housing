// app/dashboard/payments/page.tsx
import { getUserPayments } from "@/lib/actions/dashboardActions";
import { PaymentsClient } from "./PaymentsClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Receipt, TrendingUp, Wallet } from "lucide-react";
import PaymentActivityChartWrapper from "./PaymentActivityChartWrapper";

export default async function PaymentsPage() {
  const payments = await getUserPayments();

  // Calculate stats
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = payments.length;
  const avgPayment = totalTransactions ? totalPaid / totalTransactions : 0;

  // Most used payment method
  const methodCounts: Record<string, number> = {};
  payments.forEach((p) => {
    methodCounts[p.method] = (methodCounts[p.method] || 0) + 1;
  });
  const mostUsedMethod =
    Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Group by month for chart
  const paymentsByMonth: Record<string, number> = {};
  payments.forEach((p) => {
    const month = new Date(p.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    paymentsByMonth[month] = (paymentsByMonth[month] || 0) + p.amount;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground mt-1">
          View all your transactions, track payments, and download receipts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Total Paid
              <CreditCard className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              Ksh {totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime payments
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Transactions
              <Receipt className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total payments made
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Average Payment
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Ksh{" "}
              {avgPayment.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between">
              Most Used Method
              <Wallet className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold capitalize">{mostUsedMethod}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {methodCounts[mostUsedMethod]} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Activity (Chart) */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Payment Activity</CardTitle>
          <CardDescription>Monthly payment trends</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentActivityChartWrapper data={paymentsByMonth} />
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Complete payment history</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentsClient payments={payments} />
        </CardContent>
      </Card>
    </div>
  );
}
