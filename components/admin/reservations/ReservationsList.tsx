"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  updateReservationStatus,
  cancelReservationAdmin,
} from "@/lib/actions/admin/reservationAdminActions";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  paying: { label: "In Progress", color: "bg-purple-100 text-purple-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  owned: { label: "Owned", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export function ReservationsList({
  initialReservations,
  total,
  page,
  limit,
  projects,
  status,
  projectId,
  dateFrom,
  dateTo,
}: any) {
  const router = useRouter();
  const [reservations, setReservations] = useState(initialReservations);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdatingId(id);
      await updateReservationStatus(id, newStatus);
      setReservations((prev: any[]) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
      );
      router.refresh();
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setUpdatingId(id);
      await cancelReservationAdmin(id);
      setReservations((prev: any[]) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
      );
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to cancel");
    } finally {
      setUpdatingId(null);
    }
  };

  const changeFilter = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value && value !== "all") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    url.searchParams.set("page", "1");
    router.push(url.toString());
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={status || "all"}
            onValueChange={(val) => changeFilter("status", val)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="paying">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Project</label>
          <Select
            value={projectId || "all"}
            onValueChange={(val) => changeFilter("projectId", val)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p: any) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Date From</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => changeFilter("dateFrom", e.target.value)}
            className="w-36"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Date To</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => changeFilter("dateTo", e.target.value)}
            className="w-36"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            const url = new URL(window.location.href);
            url.search = "";
            router.push(url.toString());
          }}
          className="self-end"
        >
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-muted-foreground py-8"
                >
                  No reservations found
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((res: any) => {
                const statusInfo = statusConfig[res.status] || {
                  label: res.status,
                  color: "bg-gray-100",
                };
                const isUpdating = updatingId === res.id;

                return (
                  <TableRow key={res.id}>
                    <TableCell className="font-mono text-xs">
                      #{res.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{res.user_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {res.user_email}
                      </div>
                    </TableCell>
                    <TableCell>{res.project_name}</TableCell>
                    <TableCell>
                      {res.unit_number} ({res.unit_type})
                    </TableCell>
                    <TableCell>
                      Ksh {res.total_price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      Ksh {res.paid_amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {res.payment_plan}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(res.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Select
                        value={res.status}
                        onValueChange={(val) => updateStatus(res.id, val)}
                        disabled={
                          isUpdating ||
                          res.status === "completed" ||
                          res.status === "owned"
                        }
                      >
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="paying">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancel</SelectItem>
                        </SelectContent>
                      </Select>

                      {res.status !== "completed" &&
                        res.status !== "owned" &&
                        res.status !== "cancelled" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Reservation
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will cancel the reservation and release
                                  the unit. Are you sure?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Go Back</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancel(res.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {reservations.length} of {total} reservations
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("page", String(page - 1));
              router.push(url.toString());
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={reservations.length < limit}
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("page", String(page + 1));
              router.push(url.toString());
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
