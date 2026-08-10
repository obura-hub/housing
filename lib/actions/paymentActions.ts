"use server";
import { auth } from "@/auth";
import { safeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DEPOSIT_PERCENT = 0.1;
const DEPOSIT_DEADLINE_DAYS = 2;

async function getDbUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const sql = `SELECT UserId FROM [User] WHERE email = @p1`;
  const { rows } = await safeQuery(sql, [session.user.email]);
  if (rows.length === 0) throw new Error("User not found");
  return rows[0].UserId;
}

/**
 * Get the active reservation for the current user, including deposit deadline info.
 */
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
      r.reserved_at,
      r.next_payment_date,
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
  const reservation = rows[0] || null;

  if (reservation) {
    // Normalize NULL status to 'pending'
    if (!reservation.status) reservation.status = "pending";

    // Compute deposit info
    const depositAmount = reservation.total_price * DEPOSIT_PERCENT;
    const remainingDeposit = Math.max(
      0,
      depositAmount - reservation.paid_amount,
    );
    const depositDeadline = new Date(reservation.reserved_at);
    depositDeadline.setDate(depositDeadline.getDate() + DEPOSIT_DEADLINE_DAYS);

    reservation.deposit = {
      amount: depositAmount,
      remaining: remainingDeposit,
      deadline: depositDeadline.toISOString().split("T")[0],
      isOverdue: new Date() > depositDeadline,
    };
  }

  return reservation;
}

/**
 * Process a payment, update paid_amount, and adjust status accordingly.
 */
export async function processPayment(formData: FormData) {
  const userId = await getDbUserId();
  const reservationId = parseInt(formData.get("reservationId") as string);
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;
  const reference = formData.get("reference") as string;

  if (!reservationId || isNaN(amount) || amount <= 0 || !method) {
    throw new Error("Invalid payment details");
  }

  // Fetch reservation with user check
  const checkSql = `
    SELECT id, paid_amount, total_price, status, payment_plan
    FROM Reservation
    WHERE id = @p1 AND user_id = @p2
      AND (status NOT IN ('cancelled', 'completed', 'owned') OR status IS NULL)
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

  // Determine new status based on payment progress
  let newStatus = reservation.status || "pending";
  const depositAmount = reservation.total_price * DEPOSIT_PERCENT;

  if (newPaidAmount >= reservation.total_price) {
    newStatus = "completed";
  } else if (newPaidAmount >= depositAmount) {
    // Deposit is fully paid
    if (reservation.payment_plan === "installment") {
      newStatus = "paying";
    } else {
      newStatus = "confirmed"; // full payment plan, but not fully paid? Actually 'full' plan would have completed if total paid.
      // If payment_plan = 'full' and not fully paid, it's still pending/confirmed? Better to set 'confirmed'.
      if (reservation.payment_plan === "full") newStatus = "confirmed";
    }
  } else {
    // Still not enough for deposit
    newStatus = "pending";
  }

  // Update reservation
  const updateSql = `
    UPDATE Reservation
    SET paid_amount = @p2, status = @p3
    WHERE id = @p1
  `;
  await safeQuery(updateSql, [reservationId, newPaidAmount, newStatus]);

  // If status became 'paying' or 'confirmed', set next_payment_date if not already set
  if (newStatus === "paying" && reservation.payment_plan === "installment") {
    // Set next_payment_date to 30 days from now (or based on your business logic)
    // For simplicity, we'll set it to 30 days later; you can adjust.
    const nextDateSql = `
      UPDATE Reservation
      SET next_payment_date = DATEADD(day, 30, GETUTCDATE())
      WHERE id = @p1 AND next_payment_date IS NULL
    `;
    await safeQuery(nextDateSql, [reservationId]);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  redirect("/dashboard?payment_success=true");
}
