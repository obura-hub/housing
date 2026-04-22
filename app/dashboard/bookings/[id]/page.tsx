import { getReservationDetails } from "@/lib/actions/reservationActions";
import { ReservationDetailsClient } from "./ReservationDetailsClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReservationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservationDetails(parseInt(id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
        <p className="text-muted-foreground">
          View and manage your reservation.
        </p>
      </div>
      <ReservationDetailsClient reservation={reservation} />
    </div>
  );
}
