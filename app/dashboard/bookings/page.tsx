import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { getActiveReservation } from "@/lib/actions/reservationActions";

export default async function BookingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const activeBooking = await getActiveReservation();

  if (activeBooking) {
    // Redirect to the single booking detail page
    redirect(`/dashboard/bookings/${activeBooking.id}`);
  }

  // No active booking – show a friendly message
  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-primary" />
            No Active Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You don't have any active reservations. Browse our projects to find
            your dream home.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-primary underline hover:no-underline"
          >
            Browse Projects →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
