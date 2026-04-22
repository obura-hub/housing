"use server";
import { auth } from "@/auth";
import { safeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getDbUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const sql = `SELECT UserId FROM [User] WHERE email = @p1`;
  const { rows } = await safeQuery(sql, [session.user.email]);
  if (rows.length === 0) throw new Error("User not found");
  return rows[0].UserId;
}

export async function getActiveReservationForPayment() {
  const userId = await getDbUserId();
  const sql = `
    SELECT TOP 1
      r.id,
      r.total_price,
      r.paid_amount,
      r.payment_plan,
      r.monthly_installment,
      r.status,
      p.name AS project_name,
      u.unit_number
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.user_id = @p1 AND r.status NOT IN ('cancelled', 'completed', 'owned')
    ORDER BY r.reserved_at DESC
  `;
  const { rows } = await safeQuery(sql, [userId]);
  return rows[0] || null;
}

export async function processPayment(formData: FormData) {
  const userId = await getDbUserId();
  const reservationId = parseInt(formData.get("reservationId") as string);
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;
  const reference = formData.get("reference") as string;

  if (!reservationId || isNaN(amount) || amount <= 0 || !method) {
    throw new Error("Invalid payment details");
  }

  // Verify reservation belongs to user and is active
  const checkSql = `
    SELECT id, paid_amount, total_price FROM Reservation
    WHERE id = @p1 AND user_id = @p2 AND status NOT IN ('cancelled', 'completed', 'owned')
  `;
  const { rows } = await safeQuery(checkSql, [reservationId, userId]);
  if (rows.length === 0) throw new Error("No active reservation found");

  const reservation = rows[0];
  const newPaidAmount = reservation.paid_amount + amount;
  if (newPaidAmount > reservation.total_price) {
    throw new Error("Payment exceeds total price");
  }

  // Insert payment record
  const insertSql = `
    INSERT INTO Payment (reservation_id, amount, method, reference, status, payment_date)
    VALUES (@p1, @p2, @p3, @p4, 'completed', GETUTCDATE())
  `;
  await safeQuery(insertSql, [reservationId, amount, method, reference]);

  // Update reservation paid_amount and possibly status
  let newStatus = reservation.status;
  if (newPaidAmount >= reservation.total_price) {
    newStatus = "completed";
  } else if (
    reservation.payment_plan === "installment" &&
    newStatus !== "paying"
  ) {
    newStatus = "paying";
  }

  const updateSql = `
    UPDATE Reservation
    SET paid_amount = @p2, status = @p3
    WHERE id = @p1
  `;
  await safeQuery(updateSql, [reservationId, newPaidAmount, newStatus]);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  redirect("/dashboard?payment_success=true");
}
