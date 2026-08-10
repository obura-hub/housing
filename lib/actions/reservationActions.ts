"use server";
import { auth } from "@/auth";
import { safeQuery } from "@/lib/db";
import { notFound } from "next/navigation";

// Helper: get database UserId from session email
async function getDbUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email)
    throw new Error("Unauthorized: No email in session");
  const sql = `SELECT UserId FROM [User] WHERE email = @p1`;
  const { rows } = await safeQuery(sql, [session.user.email]);
  if (rows.length === 0) throw new Error("User not found in database");
  return rows[0].UserId;
}

/**
 * Create a new reservation.
 * - Sets status to 'pending'
 * - Marks the unit as unavailable (is_available = 0)
 */
export async function createReservation(data: {
  userId: string;
  projectId: number;
  unitId: number;
  unitTypeId: number;
  totalPrice: number;
  paymentPlan: "full" | "installment";
  monthlyInstallment?: number;
  downPayment?: number;
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  // Get database UserId from email
  const userSql = `SELECT UserId FROM [User] WHERE email = @p1`;
  const { rows: userRows } = await safeQuery(userSql, [session.user.email]);
  if (userRows.length === 0)
    throw new Error("User not found. Please contact support.");
  const userId = userRows[0].UserId;

  // Insert reservation
  const insertSql = `
    INSERT INTO Reservation (
      user_id, project_id, unit_id, unit_type_id, total_price, paid_amount,
      payment_plan, monthly_installment, status, reserved_at, expires_at
    )
    VALUES (
      @p1, @p2, @p3, @p4, @p5, 0, @p6, @p7, 'pending', GETUTCDATE(), DATEADD(day, 7, GETUTCDATE())
    )
  `;
  await safeQuery(insertSql, [
    userId,
    data.projectId,
    data.unitId,
    data.unitTypeId,
    data.totalPrice,
    data.paymentPlan,
    data.monthlyInstallment || null,
  ]);

  // Mark unit as unavailable
  const updateUnitSql = `UPDATE Unit SET is_available = 0 WHERE id = @p1`;
  await safeQuery(updateUnitSql, [data.unitId]);

  return { success: true };
}

/**
 * Get details of a specific reservation (for the detail page)
 */
export async function getReservationDetails(reservationId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    // Redirect or throw – we'll redirect to login via middleware, but here we handle:
    throw new Error("Unauthorized");
  }

  const userId = await getDbUserId();

  // Full query with all joins
  const sql = `
    SELECT
      r.id, r.status, r.total_price, r.paid_amount, r.payment_plan,
      r.monthly_installment, r.next_payment_date, r.reserved_at AS createdAt,
      p.id AS project_id, p.name AS project_name, p.location, p.address,
      ut.id AS unit_type_id, ut.type AS unit_type, ut.size, ut.bedrooms, ut.bathrooms, ut.price AS unit_type_price,
      u.id AS unit_id, u.unit_number, u.price_adjustment,
      b.id AS block_id, b.name AS block_name, f.floor_number
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN Floor f ON u.floor_id = f.id
    JOIN Block b ON f.block_id = b.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.id = @p1 AND r.user_id = @p2
  `;
  const { rows } = await safeQuery(sql, [reservationId, userId]);

  if (rows.length === 0) {
    // Check if reservation exists at all (for proper 404)
    const checkSql = `SELECT id FROM Reservation WHERE id = @p1`;
    const { rows: checkRows } = await safeQuery(checkSql, [reservationId]);
    if (checkRows.length === 0) {
      notFound(); // No reservation with that ID
    } else {
      // Reservation exists but doesn't belong to user – treat as 404 for security
      notFound();
    }
  }

  const reservation = rows[0];

  // Get payment history
  const paymentsSql = `
    SELECT id, amount, payment_date, reference, status, method
    FROM Payment
    WHERE reservation_id = @p1
    ORDER BY payment_date DESC
  `;
  const { rows: paymentRows } = await safeQuery(paymentsSql, [reservationId]);

  return { ...reservation, payments: paymentRows };
}

/**
 * Cancel a reservation (only allowed if status is pending or confirmed)
 */
export async function cancelReservation(reservationId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = await getDbUserId();

  const checkSql = `SELECT status FROM Reservation WHERE id = @p1 AND user_id = @p2`;
  const { rows } = await safeQuery(checkSql, [reservationId, userId]);
  if (rows.length === 0) throw new Error("Reservation not found");
  if (!["pending", "confirmed"].includes(rows[0].status)) {
    throw new Error("Cannot cancel this reservation at its current stage");
  }

  // Cancel reservation
  const updateSql = `UPDATE Reservation SET status = 'cancelled' WHERE id = @p1`;
  await safeQuery(updateSql, [reservationId]);

  // Release the unit (make it available again)
  const releaseSql = `
    UPDATE Unit SET is_available = 1
    WHERE id = (SELECT unit_id FROM Reservation WHERE id = @p1)
  `;
  await safeQuery(releaseSql, [reservationId]);

  return { success: true };
}

/**
 * Get the user's single active reservation (first one, if any).
 * Returns null if none found.
 */
export async function getActiveReservation() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = await getDbUserId();

  const sql = `
    SELECT TOP 1
      r.id,
      r.status,
      r.total_price,
      r.paid_amount,
      r.payment_plan,
      r.monthly_installment,
      r.next_payment_date,
      r.reserved_at AS createdAt,
      p.name AS project_name,
      u.unit_number
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.user_id = @p1
      AND (r.status NOT IN ('cancelled', 'completed', 'owned') OR r.status IS NULL)
    ORDER BY r.reserved_at DESC
  `;
  const { rows } = await safeQuery(sql, [userId]);
  return rows[0] || null;
}
