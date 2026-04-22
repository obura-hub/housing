"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  MapPinIcon,
  HomeIcon,
  CreditCardIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { cancelReservation } from "@/lib/actions/reservationActions";

interface ReservationDetailsClientProps {
  reservation: any;
}

const statusColors: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  paying:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  owned:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function ReservationDetailsClient({
  reservation,
}: ReservationDetailsClientProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const paymentProgress =
    (reservation.paid_amount / reservation.total_price) * 100;

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelReservation(reservation.id);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = ["pending", "confirmed"].includes(reservation.status);

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{reservation.project_name}</h2>
          <p className="text-muted-foreground">Booking ID: #{reservation.id}</p>
        </div>
        <Badge className={statusColors[reservation.status]}>
          {reservation.status.toUpperCase()}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Unit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Number</span>
                  <span className="font-medium">{reservation.unit_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Type</span>
                  <span>{reservation.unit_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span>{reservation.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bedrooms</span>
                  <span>{reservation.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bathrooms</span>
                  <span>{reservation.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block / Floor</span>
                  <span>
                    {reservation.block_name}, Floor {reservation.floor_number}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{reservation.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <HomeIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{reservation.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>
                  Paid: Ksh {reservation.paid_amount.toLocaleString()}
                </span>
                <span>
                  Total: Ksh {reservation.total_price.toLocaleString()}
                </span>
              </div>
              <Progress value={paymentProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {paymentProgress.toFixed(1)}% completed
              </p>
              {reservation.payment_plan === "installment" && (
                <div className="mt-2 p-3 bg-muted/30 rounded-lg text-sm">
                  <strong>Payment Plan:</strong> Monthly Installment of Ksh{" "}
                  {reservation.monthly_installment?.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>

          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">
                  Cancel Reservation
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your reservation will be
                    cancelled and you will lose any deposit paid.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Go Back</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All payments made towards this unit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reservation.payments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No payments recorded yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservation.payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          Ksh {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{payment.method || "—"}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.reference || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Schedule Tab (only for installment plans) */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Your installment schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              {reservation.payment_plan !== "installment" ? (
                <p className="text-center text-muted-foreground py-8">
                  You are on a full payment plan. No installment schedule
                  available.
                </p>
              ) : !reservation.next_payment_date ? (
                <p className="text-center text-muted-foreground py-8">
                  No upcoming payments scheduled.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Next Payment Due</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          reservation.next_payment_date,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        Ksh {reservation.monthly_installment?.toLocaleString()}
                      </p>
                      <Button size="sm" className="mt-2">
                        Make Payment
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Schedule is based on your monthly installment plan. Future
                    due dates will appear after each payment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
