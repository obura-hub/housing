"use server";
import { auth } from "@/auth";
import { safeQuery } from "@/lib/db";

import { notFound, redirect } from "next/navigation";

export async function getReservationDetails(reservationId: number) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sql = `
    SELECT
      r.id,
      r.status,
      r.total_price,
      r.paid_amount,
      r.payment_plan,
      r.monthly_installment,
      r.next_payment_date,
      r.reserved_at AS createdAt,
      p.id AS project_id,
      p.name AS project_name,
      p.location,
      p.address,
      ut.id AS unit_type_id,
      ut.type AS unit_type,
      ut.size,
      ut.bedrooms,
      ut.bathrooms,
      ut.price AS unit_type_price,
      u.id AS unit_id,
      u.unit_number,
      u.price_adjustment,
      b.id AS block_id,
      b.name AS block_name,
      f.floor_number
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN Floor f ON u.floor_id = f.id
    JOIN Block b ON f.block_id = b.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.id = @p1 AND r.user_id = @p2
  `;
  const { rows } = await safeQuery(sql, [reservationId, session.user.id]);
  if (rows.length === 0) notFound();
  const reservation = rows[0];

  // Get payment history
  const paymentsSql = `
    SELECT
      id,
      amount,
      payment_date,
      reference,
      status,
      method
    FROM Payment
    WHERE reservation_id = @p1
    ORDER BY payment_date DESC
  `;
  const { rows: paymentRows } = await safeQuery(paymentsSql, [reservationId]);

  return { ...reservation, payments: paymentRows };
}

export async function cancelReservation(reservationId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Only allow cancellation if status is 'pending' or 'confirmed'
  const checkSql = `
    SELECT status FROM Reservation WHERE id = @p1 AND user_id = @p2
  `;
  const { rows } = await safeQuery(checkSql, [reservationId, session.user.id]);
  if (rows.length === 0) throw new Error("Reservation not found");
  if (!["pending", "confirmed"].includes(rows[0].status)) {
    throw new Error("Cannot cancel this reservation at its current stage");
  }

  const sql = `
    UPDATE Reservation SET status = 'cancelled' WHERE id = @p1
  `;
  await safeQuery(sql, [reservationId]);
  return { success: true };
}

export async function createReservation(data: {
  userId: string; // use email instead of userId
  projectId: number;
  unitId: number;
  unitTypeId: number;
  totalPrice: number;
  paymentPlan: "full" | "installment";
  monthlyInstallment?: number;
}) {
  // First get the user's UserId from the email
  const session = await auth();

  const userEmail = session?.user?.email;
  const userSql = `SELECT UserId FROM [User] WHERE email = @p1`;
  const { rows: userRows } = await safeQuery(userSql, [userEmail]);
  if (userRows.length === 0)
    throw new Error("User not found. Please contact support.");
  const userId = userRows[0].UserId;

  const sql = `
    INSERT INTO Reservation (
      user_id, project_id, unit_id, unit_type_id, total_price, paid_amount,
      payment_plan, monthly_installment, status, reserved_at, expires_at
    )
    VALUES (
      @p1, @p2, @p3, @p4, @p5, 0, @p6, @p7, 'pending', GETUTCDATE(), DATEADD(day, 7, GETUTCDATE())
    )
  `;
  await safeQuery(sql, [
    userId,
    data.projectId,
    data.unitId,
    data.unitTypeId,
    data.totalPrice,
    data.paymentPlan,
    data.monthlyInstallment || null,
  ]);
  return { success: true };
}
