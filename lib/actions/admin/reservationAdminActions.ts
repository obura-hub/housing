"use server";
import { safeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Get all reservations with filters and pagination for admin.
 */
export async function getAdminReservations(
  page = 1,
  limit = 20,
  status = "",
  projectId = "",
  dateFrom = "",
  dateTo = "",
) {
  const offset = (page - 1) * limit;
  let where = "1=1";
  const params: any[] = [];

  if (status && status !== "all") {
    where += ` AND r.status = @p${params.length + 1}`;
    params.push(status);
  }
  if (projectId && projectId !== "all") {
    where += ` AND r.project_id = @p${params.length + 1}`;
    params.push(parseInt(projectId));
  }
  if (dateFrom) {
    where += ` AND r.reserved_at >= @p${params.length + 1}`;
    params.push(dateFrom);
  }
  if (dateTo) {
    where += ` AND r.reserved_at <= @p${params.length + 1}`;
    params.push(dateTo);
  }

  // Count total
  const countSql = `SELECT COUNT(*) AS total FROM Reservation r WHERE ${where}`;
  const { rows: countRows } = await safeQuery(countSql, params);
  const total = countRows[0]?.total || 0;

  // Get data with joins
  const dataSql = `
    SELECT
      r.id,
      r.status,
      r.total_price,
      r.paid_amount,
      r.reserved_at AS createdAt,
      r.payment_plan,
      r.monthly_installment,
      p.name AS project_name,
      u.unit_number,
      u.id AS unit_id,
      ut.type AS unit_type,
      u2.email AS user_name,      -- using email as display name
      u2.email AS user_email
    FROM Reservation r
    JOIN Project p ON r.project_id = p.id
    JOIN Unit u ON r.unit_id = u.id
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN [User] u2 ON r.user_id = u2.UserId
    WHERE ${where}
    ORDER BY r.reserved_at DESC
    OFFSET @p${params.length + 1} ROWS FETCH NEXT @p${params.length + 2} ROWS ONLY
  `;
  params.push(offset, limit);
  const { rows } = await safeQuery(dataSql, params);

  // Get list of projects for filter dropdown
  const projectSql = `SELECT id, name FROM Project ORDER BY name`;
  const { rows: projectRows } = await safeQuery(projectSql, []);

  return {
    reservations: rows,
    total,
    page,
    limit,
    projects: projectRows,
  };
}

/**
 * Update reservation status (admin only).
 * Allowed statuses: pending, confirmed, paying, completed, cancelled.
 */
export async function updateReservationStatus(id: number, newStatus: string) {
  const allowed = ["pending", "confirmed", "paying", "completed", "cancelled"];
  if (!allowed.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const sql = `UPDATE Reservation SET status = @p1 WHERE id = @p2`;
  await safeQuery(sql, [newStatus, id]);

  // If setting to cancelled, release the unit
  if (newStatus === "cancelled") {
    const releaseSql = `
      UPDATE Unit SET is_available = 1
      WHERE id = (SELECT unit_id FROM Reservation WHERE id = @p1)
    `;
    await safeQuery(releaseSql, [id]);
  }

  revalidatePath("/admin/reservations");
  return { success: true };
}

/**
 * Cancel a reservation (admin version – can cancel any status except completed/owned).
 */
export async function cancelReservationAdmin(id: number) {
  const checkSql = `SELECT status FROM Reservation WHERE id = @p1`;
  const { rows } = await safeQuery(checkSql, [id]);
  if (rows.length === 0) throw new Error("Reservation not found");
  const current = rows[0].status;
  if (current === "completed" || current === "owned") {
    throw new Error("Cannot cancel a completed or owned reservation");
  }

  const updateSql = `UPDATE Reservation SET status = 'cancelled' WHERE id = @p1`;
  await safeQuery(updateSql, [id]);
  const releaseSql = `
    UPDATE Unit SET is_available = 1
    WHERE id = (SELECT unit_id FROM Reservation WHERE id = @p1)
  `;
  await safeQuery(releaseSql, [id]);

  revalidatePath("/admin/reservations");
  return { success: true };
}
