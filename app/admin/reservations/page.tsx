import { ReservationsList } from "@/components/admin/reservations/ReservationsList";
import { getAdminReservations } from "@/lib/actions/admin/reservationAdminActions";

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    projectId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  // await requireAdmin();

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const status = params.status || "";
  const projectId = params.projectId || "";
  const dateFrom = params.dateFrom || "";
  const dateTo = params.dateTo || "";

  const { reservations, total, limit, projects } = await getAdminReservations(
    page,
    20,
    status,
    projectId,
    dateFrom,
    dateTo,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <div className="text-sm text-muted-foreground">
          Total: {total} reservations
        </div>
      </div>

      <ReservationsList
        initialReservations={reservations}
        total={total}
        page={page}
        limit={limit}
        projects={projects}
        status={status}
        projectId={projectId}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </div>
  );
}
